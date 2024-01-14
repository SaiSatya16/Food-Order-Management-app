const Customerhome = Vue.component("customerhome", {
    template: `
    <div>
   <h1>Welcome  to the Grocery Store Dashboard</h1>
   <div class="input-group mt-3">
      <input class="form-control" type="text" v-model="searchQuery" @input="searchCategory" placeholder="Search Category">
   </div>
   <div v-if="categories.length === 0">
      <h2>No Categories Found</h2>
   </div>
   <div v-else>
      <h2>Shop By Category</h2>
      <div class="row">
         <div class="col-12" v-for="category in filteredCategories" :key="category.id">
            <div v-if="category.active">
               <div class="card mb-3 ">
                  <div class="card-body">
                     <h5>
                        {{ category.name }}
                        <i class="fas" 
                           :class="{'fa-caret-down': !category.showProducts, 'fa-caret-up': category.showProducts}" 
                           @click="toggleCollapse(category.id); toggleProducts(category)">
                        </i>
                     </h5>
                     <div class="collapse mt-3" :id="'products' + category.id" >
                        <ul class="list-group">
                           <li class="list-group-item d-flex justify-content-between align-items-center" v-for="product in category.product_relation" :key="product.id">
                              <div class="d-flex align-items-center">
                                 <div>
                                    <h5 class="mb-1">
                                       {{ product.name }}
                                       <span v-if="category.Vegetarian" class="text-success-lighter">
                                       <i class="fas fa-leaf"></i>
                                       </span>
                                       <span v-else class="text-danger-lighter">
                                       <i class="fas fa-drumstick-bite"></i>
                                       </span>
                                    </h5>
                                    <span class="price">₹{{ product.rate }}</span>
                                 </div>
                              </div>

                              <div>
    <div v-if="product.req_quantity === 0">
        <button class="btn btn-outline-danger mt-2 position-relative" @click="addToCart(product)">
            <img :src="product.image" alt="Product Image" class="img-fluid embed-img" style="max-width: 80px; max-height: 80px;" />
            <span>Add</span>
        </button>
    </div>
    <div v-else>
        <div class="btn-group mt-2 position-relative">
            <button class="btn btn-outline-danger" @click="removefromcart(product)">-</button>
            <button class="btn btn-outline-danger" disabled>{{ product.req_quantity }}</button>
            <button class="btn btn-outline-danger" @click="addToCart(product)">+</button>
        </div>
    </div>
</div>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="view-cart-btn">
      <button @click = "redirecttocart" class="btn btn-primary">View Cart</button>
   </div>
      </div>
   </div>
</div>
    `,
    data() {
      return {
        categories: [],
        searchQuery: '',
        name : localStorage.getItem('username'),
        userRole: localStorage.getItem('role'),
        token: localStorage.getItem('auth-token'),
        cart: JSON.parse(localStorage.getItem('cart')) || [],

      };
    },
    computed: {
      filteredCategories() {
        const inputText = this.searchQuery.toLowerCase();
        return this.categories.filter(category => category.name.toLowerCase().includes(inputText));
      }
    },
    methods: {

      


      async getCategories() {
        try {
            const res = await fetch('/api/category', {
                headers: {
                    "content-type": "application/json",
                    "Authentication-Token": this.token,
                    "Authentication-Role": this.userRole,
                }
            });
    
            if (res.ok) {
                const data = await res.json();
                this.categories = data.map(category => ({
                    ...category,
                    showProducts: false,
                    product_relation: category.product_relation.map(product => ({
                        ...product,
                        req_quantity: 0,
                    }))
                }));
    
                // Retrieve cart data from localStorage
                const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    
                // Loop through each product in the cart and update req_quantity
                cartData.forEach(cartItem => {
                    const { product_id, req_quantity } = cartItem;
                    const existingCategory = this.categories.find(category => category.product_relation.some(product => product.id === product_id));
                    if (existingCategory) {
                        const existingProduct = existingCategory.product_relation.find(product => product.id === product_id);
                        if (existingProduct) {
                            existingProduct.req_quantity = req_quantity;
                        }
                    }
                });
            } else {
                const errorData = await res.json();
                console.error(errorData);
            }
        } catch (error) {
            console.error(error);
        }
    },
    
      toggleProducts(category) {
        category.showProducts = !category.showProducts;
      },
      toggleCollapse(categoryId) {
        const element = document.getElementById('products' + categoryId);
        if (element) {
          if (element.classList.contains('show')) {
            element.classList.remove('show');
          } else {
            element.classList.add('show');
          }
        }
      },


      async addToCart(product) {
        try {

          const quantity = 1;


          // if (!product.quantityToAdd || isNaN(parseInt(product.quantityToAdd)) || parseInt(product.quantityToAdd) < 1) {
          //   throw new Error('Please enter a valid quantity.');
          // }
          const existingProductIndex = this.cart.findIndex(item => item.product_id === product.id);
  
          if (existingProductIndex !== -1) {
            const existingProduct = this.cart[existingProductIndex];
            existingProduct.req_quantity += quantity
            product.req_quantity = existingProduct.req_quantity; 
            localStorage.setItem('cart', JSON.stringify(this.cart));
          } else {
            this.cart.push({
              user_id: localStorage.getItem('id'),
              product_id: product.id,
              product_name: product.name,
              product_rate: product.rate,
              req_quantity: quantity,
            });
            product.req_quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(this.cart));
          }

         
  
         
        } catch (error) {
          console.error(error);
          alert(error.message || 'An error occurred while adding to cart.');
        }
      },

      async removefromcart(product) {
        try {
          const quantity = 1;
          const existingProductIndex = this.cart.findIndex(item => item.product_id === product.id);
          if (existingProductIndex !== -1) {
            const existingProduct = this.cart[existingProductIndex];
            existingProduct.req_quantity -= quantity
            product.req_quantity = existingProduct.req_quantity;
            localStorage.setItem('cart', JSON.stringify(this.cart));
          } else {
            this.cart.push({
              user_id: localStorage.getItem('id'),
              product_id: product.id,
              product_name: product.name,
              product_rate: product.rate,
              req_quantity: quantity,
            });
            product.req_quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(this.cart));
          }
          
        } catch (error) {
          console.error(error);
          alert(error.message || 'An error occurred while removing from cart.');
        }
      },

      redirecttocart() {
        this.$router.push('/cart');
    },

    searchCategory() {
      
    }



     


      
      

    },
    mounted() {
      document.title = 'Customer Home';
      this.getCategories();
    }
  });
  
  
  export default Customerhome;


  