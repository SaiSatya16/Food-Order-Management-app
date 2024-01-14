const Kitchenhome = Vue.component('kitchenhome', {
    template: `
    <div>
    <div class="container mt-4">
      <!-- Orders Section -->
      <div v-if="orders.length > 0">
        <h2>Placed Orders</h2>
        <div v-for="order in orders" >
          <div v-if="!order.active" class="card mb-3" >
            <div class="card-body">
              <h5 class="card-title">Order From {{ order.user_name }}</h5>
              <span class="card-subtitle mb-2 text-muted">Name: {{ order.customer_name }}</span>
              <span class="card-subtitle mb-2 text-muted">Email: {{ order.customer_email }}</span>
              <span class="card-subtitle mb-2 text-muted">Phone No: {{ order.customer_phone }}</span>
              <!-- Show items in the order -->
              <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="product in order.product_relation" :key="product.id">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="mb-1">{{ product.product_name }}</h5>
                    </div>
                    <div>
                      <span>Qty: {{ product.req_quantity }}</span>
                    </div>
                  </div>
                </li>
              </ul>
              <!-- Button for chef to accept order -->
              <button @click="finishorder(order.id)" class="btn btn-primary mt-3">
                Finish Order
              </button>
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
        socket: null,

      };
    },
    methods: {

      setupWebSocket() {
        const socket = io('http://127.0.0.1:5000/Bought', {
          path: '/socket.io',
          // Other configurations...
        }); // Assuming SocketIO is available as 'io'
      
        socket.on('connect', () => {
          console.log('WebSocket connected');
        });
      
        socket.on('newBoughtEntry', () => {
          // Trigger a method to update orders or perform actions on new entries
          this.getallorders();
        });
      
        socket.on('disconnect', () => {
          console.log('WebSocket disconnected');
        });
      
        socket.on('error', error => {
          console.error('WebSocket error:', error);
        });
      },
      



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


      async finishorder(id) {
        const res = await fetch(`/activate/bought/${id}`, {
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
      this.setupWebSocket();
    }
  });
  
  export default Kitchenhome;
  