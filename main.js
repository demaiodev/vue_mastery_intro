Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
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
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
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
            <product-review class="review-form" @review-submitted="addReview"></product-review>
    </div>
     `,
    data() {
        return {
            product: 'Socks',
            brand: 'Vue Mastery',
            selectedVariant: 0,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [{
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 10,
                },
                {
                    variantId: 2236,
                    variantColor: 'red',
                    variantImage: 'https://cdn.shopify.com/s/files/1/0884/9106/products/socks-boston-red-socks-with-white-heel-and-toe-1.png?v=1520352543',
                    variantQuantity: 10,
                }
            ],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        emptyCart() {
            this.$emit('empty-cart');
        },
        removeItem() {
            this.$emit('remove-item', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
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
        }
    }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
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
      <input type="submit" value="Submit">  
    </p>    
  
  </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
        }
    },
    methods: {
        onSubmit() {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
            };
            this.$emit('review-submitted', productReview);
            this.name = null;
            this.review = null; 
            this.rating = null;
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        emptyCart() {
            if(confirm("Empty Cart?")) {
                this.cart = [];
            }
        },
        removeItem(idToRemove) {
            if(this.cart.includes(idToRemove)) {
                this.cart = this.cart.filter(id => {
                    return id !== idToRemove;
                });
            }
        }
    }
})