
import Customerhome from "./customerhome.js";
import Adminhome from "./adminhome.js";
import Kitchenhome from "./kitchen_home.js";

const Home =Vue.component('home', {
    template: `<div>
                <div v-if="userRole == 'Admin'">
                    <Adminhome></Adminhome>
                </div>
                <div v-if ="userRole == 'Customer'" >
                    <Customerhome></Customerhome>
                </div>
                <div v-if ="userRole == 'Kitchen'" >
                    <Kitchenhome></Kitchenhome>
                </div>

            </div>`,
                data() {
                    return {
                        userRole: localStorage.getItem('role'),
                    }

                },
                components: {
                    Kitchenhome,
                    Customerhome,
                    Adminhome,
                },
                mounted : function(){
                    document.title = "Home";
    }
});



export default Home;