const Currentorders = Vue.component('currentorders', {
    template: `
      <div>
        <div class="container mt-4">
          <!-- Orders Section -->
          <div v-if="orders.length > 0">
            <h2>Current Placed Orders</h2>
            
            <div v-for="order in orders" :key="order.id" >
              <!-- Display order details -->

              <div v-if="order.active && !order.checkout" class="card mb-3">
              
              

              <div  class="card-body">
                <h5 class="card-title">Order From {{order.user_name}}</h5>
                <span class="card-subtitle mb-2 text-muted"> Name: {{order.customer_name}}</span>
                <span class="card-subtitle mb-2 text-muted"> Email: {{order.customer_email}}</span>
                <span class="card-subtitle mb-2 text-muted"> Phone No: {{order.customer_phone}}</span>
                <!-- Show items in the order -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item" v-for="product in order.product_relation">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="mb-1">
                          {{ product.product_name }}
                        </h5>
                        <span >₹{{ product.product_rate }}</span>
                        <span > Qty: {{ product.req_quantity }}</span>
                      </div>
                      <div>
                        
                        <span > Price: ₹{{ product.req_quantity * product.product_rate }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <!-- Button for chef to accept order -->
                <button @click="checkout(order.id)" class="btn btn-primary mt-3">
                  Checkout Order
                </button>
                <div class="text-center mt-4">
                  <h5 class="lead" ref="otpValue">Total Price: ₹{{ order.totalprice }}</h5>
                </div>

              </div>
              </div>
            </div>
          </div>
          <div v-else>
            <h2>No Orders Placed</h2>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        orders: [],
        id: localStorage.getItem('id'),
        token: localStorage.getItem('auth-token'),
        userRole: localStorage.getItem('role'),
        error: null,

      };
    },
    methods: {

      async getallorders() {
        try {
         
          const res = await fetch('/api/bought', {
             headers: {
                'Authentication-Token': this.token,
                'Authentication-Role': this.userRole,
             },
          }
          
          );
          if (res.ok) {
              const data = await res.json();
              this.orders = data;
              console.log(data);
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


      async checkout(id) {
        const res = await fetch(`/checkout/bought/${id}`, {
          headers: {
            'Authentication-Token': this.token,
            'Authentication-Role': this.userRole,

          },
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          this.getallorders();
        }
      },


      
    },


    mounted(){
      document.title = "Kitchen";
      this.getallorders();
    }
  });
  
  export default Currentorders;
  