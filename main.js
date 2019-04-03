var eventBus = new Vue()

Vue.component("product", {
    props: {
        details: {
            required: true,
            type: Array
        },
        premium: {
            required: true,
            type: Boolean
        },
    },
    template: `
    <div>
        <div class="product">
        <div class="product-image">
            <img :src="image" />
        </div>
        <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">{{this.variants[this.selectedVariant].variantQuantity}} In Stock</p>
                <p v-else>Out of Stock</p>
                <p>Shipping: {{ shipping }}</p>
                <product-details :details="details"/>
                <div class="flex-container">
                    <div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId"
                        :style="{ backgroundColor: variant.variantColor }" @click="updateProduct(index)">
                    </div>
                </div>
                <div class="buttons">
                    <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">
                        Add To Cart
                    </button>
                    <button @click="removeItem">Remove Selected</button>
                    <button class="emptyCart" @click="emptyCart">Empty Cart</button>
                </div>
            </div>
            </div>

            <product-tabs :reviews="reviews"></product-tabs>


        </div>
     `,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            selectedVariant: 0,
            variants: [{
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2236,
                    variantColor: "red",
                    variantImage: "https://cdn.shopify.com/s/files/1/0884/9106/products/socks-boston-red-socks-with-white-heel-and-toe-1.png?v=1520352543",
                    variantQuantity: 10,
                }
            ],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
        },
        emptyCart() {
            this.$emit("empty-cart");
        },
        removeItem() {
            this.$emit("remove-item", this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },

    },
    computed: {
        title() {
            return this.brand + " " + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            }
            return 2.99;
        },
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },
})

Vue.component("product-details", {
    props: {
        details: {
            type: Array,
            required: true,
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,
})
 
Vue.component("product-review", {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
        <b>Please correct the following error(s)</b>
        <ul>
            <li v-for="error in errors"> {{ error }}  </li>
        </ul>
    <p/>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
        
    <p>
        <input type="radio" id="Yes" value="Yes" v-model="recommended">
        <label for="Yes">Yes</label>
        <br>
        <input type="radio" id="No" value="No" v-model="recommended">
        <label for="No">No</label>
    </p>

    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommended: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommended: this.recommended,
                };
                eventBus.$emit("review-submitted", productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommended = null;
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommended) this.errors.push("Recommendation required.")
            }
        }
    }
})

Vue.component("product-tabs", {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab"
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs" 
            :key="index"
            @click="selectedTab = tab">
            {{ tab }}
            </span>

            <div v-show="selectedTab === 'Reviews'">
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                    <p v-if="recommended == 'Yes'">User would recommend.</p>
                    <p vi-f="recommended === 'No'">User would not recommend.</p>
                </li>
            </ul>
        </div>

        <product-review v-show="selectedTab === 'Make a Review'" class="review-form"></product-review> 
        </div>

        
    `,
    data() {
        return {
            tabs: ["Reviews", "Make a Review"],
            selectedTab: "Reviews"
        }
    }
})

var app = new Vue({
    el: "#app",
    data: {
        premium: false,
        cart: [],
        details: ["80% cotton", "20% polyester", "Gender-neutral", "Brand new"]
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        emptyCart() {
            if (confirm("Empty Cart?")) {
                this.cart = [];
            }
        },
        removeItem(idToRemove) {
            if (this.cart.includes(idToRemove)) {
                this.cart = this.cart.filter(id => {
                    return id !== idToRemove;
                });
            }
        }
    }
})