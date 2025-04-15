<!-- Load GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

<script>
// Section data
let h1Texts = ["Pear", "Apple", "Exotic"];
let logoColors = ["var(--pear-logo)", "var(--apple-logo)", "var(--exotic-logo)"];
let keyframes = ["wave-pear-effect", "wave-apple-effect", "wave-exotic-effect"];
let productIds = ["9797", "9409", "9393"]; // Add-to-cart products per slide

// Animate fruit
gsap.from(".fruit-image", { y: "-100vh", delay: 0.5 });
gsap.to(".fruit-image img", {
  x: "random(-20, 20)",
  y: "random(-20, 20)",
  zIndex: 22,
  duration: 2,
  ease: "none",
  yoyo: true,
  repeat: -1
});

const sections = document.querySelectorAll(".section");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const caneLabels = document.querySelector(".cane-labels");
const sectionContainer = document.querySelector(".section-container");

let currentIndex = 0;
let currentPosition = 0;

// Create Add to Cart button once, below slider
const addToCartWrapper = document.createElement("div");
addToCartWrapper.id = "add-to-cart-wrapper";
addToCartWrapper.style.cssText = `
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
`;

const btn = document.createElement("a");
btn.href = `?add-to-cart=${productIds[currentIndex]}`;
btn.setAttribute("data-quantity", "1");
btn.setAttribute("data-product_id", productIds[currentIndex]);
btn.className = "button product_type_simple add_to_cart_button ajax_add_to_cart";
btn.textContent = "Add to Cart";
Object.assign(btn.style, {
  padding: "16px 30px",
  background: "#fff",
  color: "#000",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "18px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  textDecoration: "none",
  cursor: "pointer",
});

addToCartWrapper.appendChild(btn);
document.body.appendChild(addToCartWrapper);

// Update the Add to Cart button
function updateCartButton() {
  const id = productIds[currentIndex];
  btn.href = `?add-to-cart=${id}`;
  btn.setAttribute("data-product_id", id);
}

// Navigation logic
nextButton.addEventListener("click", () => {
  if (currentPosition > -200) {
    currentPosition -= 100;
    caneLabels.style.left = `${currentPosition}%`;
    sectionContainer.style.left = `${currentPosition}%`;
  }

  currentIndex++;
  if (currentIndex < h1Texts.length) {
    document.querySelector(".h1").innerHTML = h1Texts[currentIndex];
  }

  updateCartButton();

  gsap.to(".logo", { opacity: 1, duration: 1, color: logoColors[currentIndex] });
  gsap.from(".h1", { y: "20%", opacity: 0, duration: 0.5 });
  gsap.from(".fruit-image", { y: "-100vh", delay: 0.4, duration: 0.4 });

  if (currentIndex === h1Texts.length - 1) nextButton.style.display = "none";
  if (currentIndex > 0) prevButton.style.display = "block";

  nextButton.style.color = logoColors[currentIndex + 1];
  prevButton.style.color = logoColors[currentIndex - 1];
  nextButton.style.animationName = keyframes[currentIndex + 1];
  prevButton.style.animationName = keyframes[currentIndex - 1];
});

prevButton.addEventListener("click", () => {
  if (currentPosition < 0) {
    currentPosition += 100;
    caneLabels.style.left = `${currentPosition}%`;
    sectionContainer.style.left = `${currentPosition}%`;
    sectionContainer.style.transition = `all 0.5s ease-in-out`;
  }

  currentIndex--;
  if (currentIndex >= 0) {
    document.querySelector(".h1").innerHTML = h1Texts[currentIndex];
  }

  updateCartButton();

  gsap.to(".logo", { color: logoColors[currentIndex], duration: 1 });
  gsap.from(".h1", { y: "20%", opacity: 0, duration: 0.5 });
  gsap.from(".fruit-image", { y: "100vh", delay: 0.5 });

  nextButton.style.display = "block";
  if (currentIndex === 0) prevButton.style.display = "none";

  nextButton.style.color = logoColors[currentIndex + 1];
  prevButton.style.color = logoColors[currentIndex - 1];
  nextButton.style.animationName = keyframes[currentIndex + 1];
  prevButton.style.animationName = keyframes[currentIndex - 1];
});

// Dynamically load jQuery + WooCommerce Add to Cart scripts & reinitialize
(function loadWooScriptsIfMissing() {
  function initWoo() {
    const addToCart = document.createElement('script');
    addToCart.src = '/wp-content/plugins/woocommerce/assets/js/frontend/add-to-cart.min.js';
    document.body.appendChild(addToCart);

    const cartFragments = document.createElement('script');
    cartFragments.src = '/wp-content/plugins/woocommerce/assets/js/frontend/cart-fragments.min.js';
    document.body.appendChild(cartFragments);

    addToCart.onload = function () {
      if (typeof jQuery !== 'undefined') {
        jQuery(function ($) {
          $(document.body).trigger('wc_fragments_loaded');
          $(document.body).trigger('wc_cart_button_updated');
          $(document.body).trigger('wc_setup_cart_fragments');
        });
      }
    };
  }

  if (!window.jQuery) {
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    document.head.appendChild(jqueryScript);
    jqueryScript.onload = initWoo;
  } else {
    initWoo();
  }
})();
</script>
