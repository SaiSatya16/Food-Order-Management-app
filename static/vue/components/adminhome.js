const Adminhome = Vue.component("adminhome", {
    template:  `<div class="container mt-4">
    <div class="row">
       <div class="col-lg-8 offset-lg-2">
          <!-- Welcome Message -->
          <div class="jumbotron">
             <h1 class="display-6">Welcome, {{userRole}}!</h1>
             <h5>To Food Order Management System</h5>
             <hr class="my-4">
             <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
             Add Category
             </button>
          </div>
          <div class="alert alert-danger" v-if="error">
             {{ error }}
          </div>
          <div v-if="categories.length == 0">
             <h2>No Categories Found</h2>
          </div>
          <div v-else>
             <!-- List of Categories -->
             <h2>List of Categories</h2>
             <div class="list-group">
                <div v-for="category in categories" :key="category.id" >
                   <div class="list-group-item list-group-item-action">
                      <div class="d-flex w-100 justify-content-between">
                         <h5 class="mb-1">
                            {{ category.name }}
                            <span v-if="category.active" class="text-success"><i class="fas fa-check-circle"></i></span>
                            <span v-else class="text-warning"><i class="fas fa-exclamation-circle"></i></span>
                            <span v-if="category.Vegetarian" class="text-success-lighter"><i class="fas fa-leaf"></i></span>
                            <span v-if="category.Vegetarian === false" class="text-danger-lighter"><i class="fas fa-drumstick-bite"></i></span>
                         </h5>
                         <img :src="category.image" alt="Category Image" style="max-width: 50px; max-height: 50px;" />
                      </div>
                      <div class="d-flex justify-content-between align-items-center">
                         <div>
                            <button v-if="category.active" class="btn btn-sm btn-outline-primary" type="button"  data-bs-toggle="collapse" :data-bs-target="'#products' + category.id" aria-expanded="false" aria-controls="'products' + category.id">
                            View Products
                            </button>
                            <button v-if="category.active" type="button" class="btn btn-sm btn-outline-secondary" :data-bs-target="'#editModal' + category.id" data-bs-toggle="modal">
                            Edit 
                            </button>
                            <button type="button" v-if="category.active" class="btn btn-sm btn-outline-success" :data-bs-target="'#productModal' + category.id" data-bs-toggle="modal">
                            Add Product
                            </button>
                            <button v-if="category.active" type="button" class="btn btn-sm btn-outline-danger" @click="deletecategory(category.id)">
                            Delete
                            </button>
                            <button v-if="!category.active" class="btn btn-sm btn-outline-primary" @click="approve(category.id)">
                            Activate
                            </button>
                            <button v-if="category.active" class="btn btn-sm btn-outline-danger" @click="disapprove(category.id)">
                            Deactivate
                            </button>
                         </div>
                      </div>
                      <div class="collapse mt-2" :id="'products' + category.id" >
                         <!-- Products List -->
                         <ul class="list-group">
                            <li class="list-group-item" v-for="product in category.product_relation">
                               <div class="d-flex w-100 justify-content-between">
                                  <h5 class="mb-1">
                                     {{ product.name }}
                                     <span v-if="product.active" class="text-success"><i class="fas fa-check-circle"></i></span>
                                     <span v-else class="text-warning"><i class="fas fa-exclamation-circle"></i></span>
                                     <span v-if="category.Vegetarian" class="text-success-lighter"><i class="fas fa-leaf"></i></span>
                                     <span v-if="!category.Vegetarian" class="text-danger-lighter"><i class="fas fa-drumstick-bite"></i></span>
                                  </h5>
                                  <img :src="product.image" alt="Product Image" style="max-width: 50px; max-height: 50px;" />
                               </div>
                               <span class="price">₹{{ product.rate }}</span>
                               <div class="buttons">
                                  <button v-if="product.active" type="button" class="btn btn-sm btn-outline-secondary" :data-bs-target="'#producteditModal' + product.id" data-bs-toggle="modal">
                                  Edit
                                  </button>
                                  <button v-if="product.active" type="button" class="btn btn-sm btn-outline-danger" @click="deleteProduct(product.id,category.id)">
                                  Delete
                                  </button>
                                  <button v-if="!product.active" class="btn btn-sm btn-outline-primary" @click="approvepro(product.id,category.id)">
                                  Activate
                                  </button>
                                  <button v-if="product.active" class="btn btn-sm btn-outline-danger" @click="disapprovepro(product.id,category.id)">
                                  Deactivate
                                  </button>
                               </div>
                            </li>
                         </ul>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
       <div v-for="category in categories" :key="category.id">
          <div class="modal fade" :id="'editModal' + category.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="'editModalLabel' + category.id" aria-hidden="true">
             <div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                      <h1 class="modal-title fs-5" :id="'editModal' + category.id">Edit Category</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                   </div>
                   <div class="modal-body">
                      <div class="my-3">
                         <label for="title">Enter Category Name</label>
                         <input v-model="category.name" type="text" id="Categoryname" class="form-control" :placeholder= "category.name">
                      </div>
                      <div class="my-3">
                         <label for="Vegetarian">Type:</label>
                         <select v-model="category.Vegetarian" id="Vegetarian" class="form-control">
                            <option value="true">Veg</option>
                            <option value="false">Non-Veg</option>
                         </select>
                      </div>
                      <div class="my-3">
                         <label for="categoryImage">Upload Category Image</label>
                         <input  type="file" @change="handleImageUpload(category, $event)">
                      </div>
                   </div>
                   <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" @click="editcategory(category)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                   </div>
                </div>
             </div>
          </div>
       </div>
       <div v-for="category in categories">
          <div class="modal fade" :id="'productModal'+ category.id" tabindex="-1" role="dialog" aria-labelledby="'productModalLabel'+ category.id"
             aria-hidden="true">
             <div class="modal-dialog" role="document">
                <div class="modal-content">
                   <div class="modal-header">
                      <h5 class="modal-title" :id="'productModal'+ category.id">Product Form</h5>
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      </button>
                   </div>
                   <div class="modal-body">
                      <div class="form-group">
                         <label for="name">Name:</label>
                         <input v-model="productname" type="text" class="form-control" id="productname" name="productname" required>
                      </div>
                      <div class="form-group">
                         <label for="rate">Rate/unit:</label>
                         <input v-model="rate" type="number" class="form-control" id="rate" name="rate" required>
                      </div>
                      <div class="modal-footer">
                         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                         <button type="button" @click="addproduct(category.id)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
       <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
             <div class="modal-content">
                <div class="modal-header">
                   <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Category</h1>
                   <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                   <div class="my-3">
                      <label for="Categoryname">Enter Category Name</label>
                      <input v-model="Categoryname" type="text" id="Categoryname" class="form-control" placeholder="Categoryname">
                   </div>
                   <div class="my-3">
                      <label for="Vegetarian">Type:</label>
                      <select v-model="Vegetarian" id="Vegetarian" class="form-control" placeholder="Type">
                         <option value="true">Veg</option>
                         <option value="false">Non-Veg</option>
                      </select>
                   </div>
                </div>
                <div class="modal-footer">
                   <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                   <button type="button" @click="addcategory" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                </div>
             </div>
          </div>
       </div>
    </div>
    <div v-for = "category in categories">
       <div v-for = "product in category.product_relation">
          <div class="modal fade" :id="'producteditModal' + product.id " tabindex="-1" role="dialog" aria-labelledby="'producteditModalLabel' + product.id"
             aria-hidden="true">
             <div class="modal-dialog" role="document">
                <div class="modal-content">
                   <div class="modal-header">
                      <h5 class="modal-title" :id="'producteditModal'+ product.id">Product Edit Form</h5>
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      </button>
                   </div>
                   <div class="modal-body">
                      <div class="form-group">
                         <label for="name">Name:</label>
                         <input v-model="product.name" type="text" class="form-control" id="productname" name="productname"  required>
                      </div>
                      <div class="form-group">
                         <label for="rate">Rate/unit:</label>
                         <input v-model="product.rate" type="number" class="form-control" id="rate" name="rate"  required>
                      </div>
                      <div class="form-group">
                         <label for="productImage">Upload Product Image</label>
                         <input  type="file" @change="prohandleImageUpload(product, $event)">
                      </div>
                      <div class="modal-footer">
                         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                         <button type="button" @click="editProduct(product)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
 </div>`,
data() {
    return {
    categories: [],
    Categoryname: null,
    Vegetarian: null,
    productname: null,
   rate: null,
    error: null,
    userRole: localStorage.getItem('role'),
    token: localStorage.getItem('auth-token'),
    };
},
methods: {

   async getcategory() {
      try {
         
         const res = await fetch('/api/category', {
            headers: {
               'Authentication-Token': this.token,
               'Authentication-Role': this.userRole,
            },
         }
         
         );
         if (res.ok) {
             const data = await res.json();
             this.categories = data;
          }
            else {
               const errorData = await res.json();
               console.error(errorData);
            }
         } catch (error) {
            console.error(error);
            this.error = error;
         }
         
      },
   
    async addcategory() {
    const res = await fetch("/api/category", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authentication-Token": this.token,
        "Authentication-Role": this.userRole,

        },
        body: JSON.stringify({
        name: this.Categoryname,
        vegetarian: this.Vegetarian,
        active: true,
        }),
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
        this.getcategory();
    } else {
        const data = await res.json();
        console.log(data);
        this.error = data.error_message;

    }
    },

    async deletecategory(id) {
    //are you sure?
    const do_delete = confirm("Are you sure you want to delete this category?");
    if (do_delete) {
      const res = await fetch("/api/category/" + id, {
          method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token,
            "Authentication-Role": this.userRole,
            },
      });
      if (res.ok) {
          const data = await res.json();
          console.log(data);
          this.getcategory();
      } else {
          const data = await res.json();
          console.log(data);
          this.error = data.error_message;

      }
    }
    },
    async editcategory(category) {
        this.categoryname = category.name;
        this.Veg_etarian = category.Vegetarian;
        const res = await fetch("/api/category/" + category.id, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
         "Authentication-Token": this.token,
         "Authentication-Role": this.userRole,
        },
        body: JSON.stringify({
        name: this.categoryname,
        vegetarian: this.Veg_etarian,
        active: true,
        }),
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
         this.getcategory();
    } else {
        const data = await res.json();
        console.log(data);
        this.error = data.error_message;

    }
    },

    async addproduct(id) {
      const res = await fetch("/api/product/" + id, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          "Authentication-Token": this.token,
          "Authentication-Role": this.userRole,
          },
          body: JSON.stringify({
          name: this.productname,
          rate: this.rate,
          active: true,
          }),
      });
      if (res.ok) {
          const data = await res.json();
          console.log(data);
          this.getcategory()
      } else {
          const data = await res.json();
          console.log(data);
          this.error = data.error_message;

      }
      },

      async editProduct(product) {
         this.productname = product.name;
         this.rate = product.rate;
         this.categoryid = product.category_id;
         try {
             const res = await fetch('/api/product/' + product.id, {
                 method: 'PUT',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authentication-Token': this.token,
                     'Authentication-Role': this.userRole,
                 },
                 body: JSON.stringify({
                     name: this.productname,
                     rate: this.rate,
                     category_id : this.categoryid,
                     active: true,
                 }),
             });
             if (res.ok) {
                 this.getcategory();
             }
         } catch (error) {
             console.log(error);
             this.error = error;
         }
       },

       async deleteProduct(id,cid) {
         //are you sure?
         const do_delete = confirm("Are you sure you want to delete this Product?");
         if (!do_delete) {
             return; //do nothing if cancel
         }   
           try {
               const res = await fetch('/api/product/' + id, {
                   method: 'DELETE',
                   headers: {
                       'content-type': 'application/json',
                       'Authentication-Token': this.token,
                       'Authentication-Role': this.userRole,
                   },
               });
               if (res.ok) {
                   this.getcategory(); 
               }
           } catch (error) {
               console.log(error);
               this.error = error;
           }
       },


       async prohandleImageUpload(product, event) {
         this.categoryid = product.category_id;
         const file = event.target.files[0];
         const formData = new FormData();
         formData.append('image', file);
     
         try {
           const res = await fetch(`/api/product/${product.id}/upload-image`, {
             method: 'POST',
             headers: {
               'Authentication-Token': this.token,
               'Authentication-Role': this.userRole,
             },
             body: formData,
           });
     
           if (res.ok) {
             const data = await res.json();
             console.log(data); // Handle success response
            //  this.Getproducts(this.categoryid);
           } else {
             const data = await res.json();
             console.error(data);
             this.error = data.error; // Handle error response
           }
         } catch (error) {
           console.error(error); // Handle fetch error
           this.error = error;
         }
       },
    

    async approve(id) {
        const res = await fetch(`/activate/category/${id}`, {
          headers: {
            'Authentication-Token': this.token,
            'Authentication-Role': 'Admin',

          },
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          this.getcategory();
        }
      },
      async disapprove(id) {
        const res = await fetch(`/deactivate/category/${id}`, {
          headers: {
            'Authentication-Token': this.token,
            'Authentication-Role': 'Admin',
            
          },
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
            this.getcategory();
        }
      },

      async approvepro(id,cid) {
         const res = await fetch(`/activate/product/${id}`, {
            headers: {
               'Authentication-Token': this.token,
               'Authentication-Role': 'Admin',
   
            },
         });
         const data = await res.json();
         if (res.ok) {
            alert(data.message);
            this.getcategory();
         }
         },
         async disapprovepro(id,cid) {
         const res = await fetch(`/deactivate/product/${id}`, {
            headers: {
               'Authentication-Token': this.token,
               'Authentication-Role': 'Admin',
               
            },
         });
         const data = await res.json();
         if (res.ok) {
            alert(data.message);
            this.getcategory();
         }
         }
      ,
 

      async handleImageUpload(category, event) {
         const file = event.target.files[0];
         const formData = new FormData();
         formData.append('image', file);
     
         try {
           const res = await fetch(`/api/category/${category.id}/upload-image`, {
             method: 'POST',
             headers: {
               'Authentication-Token': this.token,
               'Authentication-Role': this.userRole,
               
             },
             body: formData,
           });
     
           if (res.ok) {
             const data = await res.json();
             console.log(data); // Handle success response
               this.getcategory();
           } else {
             const data = await res.json();
             console.error(data);
             this.error = data.error; // Handle error response
           }
         } catch (error) {
           console.error(error); // Handle fetch error
           this.error = error;
         }
       },




},
mounted: function () {
    document.title = "Admin Home";
      this.getcategory();
},


});



export default Adminhome;