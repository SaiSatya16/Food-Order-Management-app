const Login =Vue.component('login', {
    template: `<div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="text-center">Login Form</h2>
        <div class="alert alert-danger" v-if="error">
          {{ error }}
        </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="text" class="form-control" id="username" name="username" placeholder="Enter email"
            v-model="cred.email">
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="Enter password"
            v-model="cred.password">
          </div>
          <button type="submit" class="btn btn-primary" @click='login'>Login</button>
          
         
        
      </div>
    </div>
  </div>`,
  data() {
    return {
      cred: {
        email: null,
        password: null,
      },
      error: null,
    }
  },
    methods: {
        async login() {
          const res = await fetch('/user-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.cred),
          });
          if(res.ok){
            const data = await res.json();
            console.log(data);
            localStorage.setItem('auth-token', data.token);
            localStorage.setItem('role', data.role);

            //if role is Customer then fetch the cart data and store it in local storage
            // if(data.role == "Customer"){
            //   const res = await fetch('/api/cart/' + data.id , {
            //     headers: {
            //       'Authentication-Token': data.token,
            //       'Authentication-Role': data.role,
            //     },
            //   });
            //   if(res.ok){
            //     const cartdata = await res.json();
            //     localStorage.setItem('cart', JSON.stringify(cartdata));
            //   }
            // }
            localStorage.setItem('id', data.id);
            localStorage.setItem('username', data.username);
            this.$router.push('/');
        }
        else{
            const data = await res.json();
            console.log(data);
            this.error = data.message;

        }
        }
    },


    mounted : function(){
        document.title = "Login";
    }
});

export default Login;