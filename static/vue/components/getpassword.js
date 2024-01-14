const Getpassword =Vue.component('getpassword', {
    template: `
    <div >
    <div class="  container-fluid d-flex align-items-center justify-content-center vh-10">
        <div class="jumbotron">
            <h1 class="display-1 text-center">Welcome to Pandas Kitchen!</h1>
            <h5 class="text-center">Copy the unique password for your table given below and login with that password to order food!</h5>
            <!-- Image -->
            <img src="static/images/pandaskitchen_1.jpeg" class="img-fluid mx-auto d-block" alt="Pandas Kitchen Image">

            
            <div class="alert alert-danger" role="alert" v-if="error">
                {{ error }}
            </div>

            <div class="text-center mt-4">
                <h5 class="lead" ref="otpValue">{{ otp }}</h5>
                <button class="btn btn-outline-secondary" @click="copyToClipboard">
                    <i class="fa fa-copy"></i> Copy Password
                </button>
            </div>

            <div class="text-center mt-4">
                <button type= "button"  @click="sendtologin" class="btn btn-success">Login to Order Food</button>
            </div>
        </div>
    </div>
</div>



`,

data() {
    return {
        otp: null,
        table_id : this.$route.params.id,
        error : null,
    };
},

methods: {

    async generateOTP() {
        const response = await fetch('/user-password/' + this.table_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            this.otp = data.password;
        }
        else {
            const data = await response.json();
            this.error = data.message;
        }
    },

    async sendtologin() {
        this.$router.push({ path: '/login' });
    },

    


    copyToClipboard() {
        const range = document.createRange();
        range.selectNode(this.$refs.otpValue);
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();
            alert('OTP copied to clipboard!');
        }
    }
},
mounted() {
    this.generateOTP();
}



});



export default Getpassword;