const Cart = Vue.component("cart", {
    template:  `<div>
    <div class="container mt-4">
       <div class="row">
          <div class="col-lg-8 offset-lg-2">
             <!-- Welcome Message -->
             <div class="jumbotron">
                <h1 class="display-4">Welcome, {{username}}!</h1>
             </div>
             <div class="alert alert-danger" role="alert" v-if="error">
                {{error}}
             </div>
             <!--List of Categories -->
             <div v-if="products.length == 0">
                <h2>No Products Found</h2>
             </div>
             <div v-else>
                <h2>List of Products in your Cart</h2>
                <ul class="list-group">
                   <li class="list-group-item d-flex justify-content-between align-items-center" v-for="product in products"  >
                      <div v-if = "product.req_quantity > 0" class="d-flex align-items-center">
                         <div>
                            <h5 class="mb-1">
                               {{ product.product_name }}
                            </h5>
                            <span >₹{{ product.product_rate }}</span>
                         </div>
                      </div>
                      <div>
                         <div v-if="product.req_quantity > 0">
                            <div class="btn-group mt-2 position-relative">
                               <button class="btn btn-outline-danger" @click="removefromcart(product)">-</button>
                               <button class="btn btn-outline-danger" disabled>{{ product.req_quantity }}</button>
                               <button class="btn btn-outline-danger" @click="addToCart(product)">+</button>
                            </div>
                            <span class="price"> ₹{{product.req_quantity*product.product_rate}} </span>
                         </div>
                      </div>
                   </li>
                </ul>
                <div class="text-right mt-3" v-if="products.length > 0">
                   <h4 style="font-size: 2.5rem;">Grand Total: ₹{{ grandTotal }}</h4>
                   <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Proceed to Order
             </button>
                </div>
             </div>
          </div>
       </div>
    </div>



    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
      <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Category</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               
          
      </div>
      <div class="modal-body">
        <!-- Form fields for customer information -->
        <div class="form-group">
          <label for="customerName">Name</label>
          <input type="text" class="form-control" id="customerName" v-model="customername" required>
        </div>
        <div class="form-group">
          <label for="customerPhoneNumber">Phone Number</label>
          <input type="text" class="form-control" id="customerPhoneNumber" v-model="customerphoneNumber">
        </div>
        <div class="form-group">
          <label for="customerEmail">Email</label>
          <input type="email" class="form-control" id="customerEmail" v-model="customeremail">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click="proceedToBuy">Place Order</button>
      </div>
    </div>
  </div>
       </div>




 </div>`,

    data() {
      return {
        products: [],
        username : localStorage.getItem('username'),
        token: localStorage.getItem('auth-token'),
        error: null,
        userid : localStorage.getItem('id'),
        userRole: localStorage.getItem('role'),
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        customername : null,
        customerphoneNumber : null,
        customeremail : null,


        
      };
    }
    ,
    methods: {
      async getProductsfromcart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.products = cart;   
      },


      async addToCart(product) {
        try {

          const quantity = 1;


          // if (!product.quantityToAdd || isNaN(parseInt(product.quantityToAdd)) || parseInt(product.quantityToAdd) < 1) {
          //   throw new Error('Please enter a valid quantity.');
          // }
          const existingProductIndex = this.cart.findIndex(item => item.product_id === product.product_id);
  
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
          const existingProductIndex = this.cart.findIndex(item => item.product_id === product.product_id);
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




        async deleteProduct(id) {
            //are you sure?
            if (!confirm('Are you sure you want to delete this product from cart?')) {
            return;
            }
            try {
                const res = await fetch('/api/cart/' + id, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'Authentication-Token': this.token,
                    'Authentication-Role': this.userRole,
                },
                });
                if (res.ok) {
                this.getProducts();
                } else {
                const errorData = await res.json();
                console.error(errorData);
                }
            } catch (error) {
                console.error(error);
            }
            },
            async proceedToBuy() {
                try {
                    const currentDate = new Date();
                    const day = String(currentDate.getDate()).padStart(2, '0');
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const year = currentDate.getFullYear();
            
                    const formattedDate = `${year}-${month}-${day}`;

                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    

                    
            
                    const res = await fetch('/Buy/' + this.userid, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            'Authentication-Token': this.token,
                            'Authentication-Role': this.userRole,
                        },
                        body: JSON.stringify({
                            date: formattedDate,
                            customer_name: this.customername,
                            customer_phone_number: this.customerphoneNumber,
                            customer_email: this.customeremail,
                            cart: this.cart,
                            total_amount: this.grandTotal,
                        }),
                    });
            
                    if (res.ok) {
                        alert('Order Placed Successfully');
                        localStorage.removeItem('cart');
                        this.$router.push('/ordersuccess');
                        return res.json();
                    } else {
                        const data = await res.json();
                        alert(data.message);
                        error = data.message;
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            
            



    },

    computed: {
        grandTotal() {
          return this.products.reduce(
            (total, product) => total + product.product_rate * product.req_quantity,
            0
          );
        },
      },

    mounted: function () {
      document.title = "Cart";
      this.getProductsfromcart();
    },


  
  });
  
  export default Cart;