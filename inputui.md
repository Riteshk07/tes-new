## searching input: here you can manage the width according to requirement

**html:**

    <body>
        <div class="search-container">
            <input
                type="text"
                placeholder="Search for products"
                class="search-input"
            />
            <svg
                class="search-icon"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="22"
                height="22"
                viewBox="0 0 30 30"
                fill="#6B7280"
            >
                <path
                    d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"
                ></path>
            </svg>
        </div>
    </body>

**css:**

    body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f5f5f5;
            }
    
            .search-container {
                display: flex;
                align-items: center;
                border: 1px solid rgba(107, 114, 128, 0.3);
                width: 320px;
                transition: border-color 0.3s ease;
                padding-right: 12px;
                gap: 8px;
                background-color: white;
                height: 46px;
                border-radius: 5px;
                overflow: hidden;
            }
    
            .search-container:focus-within {
                border-color: #6366f1;
            }
    
            .search-input {
                width: 100%;
                height: 100%;
                padding-left: 16px;
                outline: none;
                border: none;
                font-size: 14px;
            }
    
            .search-input::placeholder {
                color: #6b7280;
            }
    
            .search-icon {
                flex-shrink: 0;
            }

## form text input: you can change their width according to requirement

**HTML:**

    <body>
        <div class="input-container">
            <span class="gradient-bar"></span>
            <input
                type="text"
                id="input"
                placeholder=" "
                class="floating-input"
            />
            <label for="input" class="floating-label">
                Write Here
            </label>
        </div>
    </body>

**style:**

    <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f5f5f5;
            }
    
            .input-container {
                position: relative;
                width: 240px;
            }
    
            .gradient-bar {
                position: absolute;
                left: -2px;
                top: 8px;
                bottom: 8px;
                width: 6px;
                border-radius: 3px;
                background: linear-gradient(to bottom, #6366f1, #a855f7);
                opacity: 0.7;
                transition: all 0.3s ease;
            }
    
            .input-container:focus-within .gradient-bar {
                opacity: 1;
            }
    
            .floating-input {
                width: 100%;
                padding: 24px 16px 8px 24px;
                font-size: 14px;
                color: #1f2937;
                background-color: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                outline: none;
                transition: all 0.3s ease 0.2s;
            }
    
            .floating-input::placeholder {
                color: transparent;
            }
    
            .floating-input:focus {
                border-color: transparent;
                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
            }
    
            .floating-label {
                position: absolute;
                left: 24px;
                top: 14px;
                font-size: 14px;
                color: #6b7280;
                transition: all 0.2s ease-in-out;
                cursor: text;
                pointer-events: none;
            }
    
            .floating-input:placeholder-shown + .floating-label {
                top: 14px;
                font-size: 16px;
                color: #9ca3af;
            }
    
            .floating-input:focus + .floating-label,
            .floating-input:not(:placeholder-shown) + .floating-label {
                top: 4px;
                font-size: 14px;
                color: #6366f1;
                font-weight: 600;
            }
        </style>


## form1:

**Html:**

    <form class="form">
        <div class="flex-column">
          <label>Email </label></div>
          <div class="inputForm">
            <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg"><g id="Layer_3" data-name="Layer 3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path></g></svg>
            <input type="text" class="input" placeholder="Enter your Email">
          </div>
        
        <div class="flex-column">
          <label>Password </label></div>
          <div class="inputForm">
            <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path></svg>        
            <input type="password" class="input" placeholder="Enter your Password">
            <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></svg>
          </div>
        
        <div class="flex-row">
          <div>
          <input type="checkbox">
          <label>Remember me </label>
          </div>
          <span class="span">Forgot password?</span>
        </div>
        <button class="button-submit">Sign In</button>
        <p class="p">Don't have an account? <span class="span">Sign Up</span>
    
        </p><p class="p line">Or With</p>
    
        <div class="flex-row">
          <button class="btn google">
            <svg version="1.1" width="20" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
    <path style="fill:#FBBB00;" d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
    	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
    	C103.821,274.792,107.225,292.797,113.47,309.408z"></path>
    <path style="fill:#518EF8;" d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
    	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
    	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"></path>
    <path style="fill:#28B446;" d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
    	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
    	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"></path>
    <path style="fill:#F14336;" d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
    	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
    	C318.115,0,375.068,22.126,419.404,58.936z"></path>
    
    </svg>
       
            Google 
            
          </button><button class="btn apple">
    <svg version="1.1" height="20" width="20" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22.773 22.773" style="enable-background:new 0 0 22.773 22.773;" xml:space="preserve"> <g> <g> <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"></path> <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"></path> </g></g></svg>
    
            Apple 
            
    </button></div></form>

**css:**

    .form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      background-color: #ffffff;
      padding: 30px;
      width: 450px;
      border-radius: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    ::placeholder {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    .form button {
      align-self: flex-end;
    }
    
    .flex-column > label {
      color: #151717;
      font-weight: 600;
    }
    
    .inputForm {
      border: 1.5px solid #ecedec;
      border-radius: 10px;
      height: 50px;
      display: flex;
      align-items: center;
      padding-left: 10px;
      transition: 0.2s ease-in-out;
    }
    
    .input {
      margin-left: 10px;
      border-radius: 10px;
      border: none;
      width: 85%;
      height: 100%;
    }
    
    .input:focus {
      outline: none;
    }
    
    .inputForm:focus-within {
      border: 1.5px solid #2d79f3;
    }
    
    .flex-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      justify-content: space-between;
    }
    
    .flex-row > div > label {
      font-size: 14px;
      color: black;
      font-weight: 400;
    }
    
    .span {
      font-size: 14px;
      margin-left: 5px;
      color: #2d79f3;
      font-weight: 500;
      cursor: pointer;
    }
    
    .button-submit {
      margin: 20px 0 10px 0;
      background-color: #151717;
      border: none;
      color: white;
      font-size: 15px;
      font-weight: 500;
      border-radius: 10px;
      height: 50px;
      width: 100%;
      cursor: pointer;
    }
    
    .button-submit:hover {
      background-color: #252727;
    }
    
    .p {
      text-align: center;
      color: black;
      font-size: 14px;
      margin: 5px 0;
    }
    
    .btn {
      margin-top: 10px;
      width: 100%;
      height: 50px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 500;
      gap: 10px;
      border: 1px solid #ededef;
      background-color: white;
      cursor: pointer;
      transition: 0.2s ease-in-out;
    }
    
    .btn:hover {
      border: 1px solid #2d79f3;
      ;
    }


## form2:

**html:**
 

    <div class="master-container">
      <div class="card cart">
        <label class="title">Your cart</label>
        <div class="products">
          <div class="product">
            <svg fill="none" viewBox="0 0 60 60" height="60" width="60" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#FFF6EE" rx="8.25" height="60" width="60"></rect>
    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.25" stroke="#FF8413" fill="#FFB672" d="M34.2812 18H25.7189C21.9755 18 18.7931 20.5252 17.6294 24.0434C17.2463 25.2017 17.0547 25.7808 17.536 26.3904C18.0172 27 18.8007 27 20.3675 27H39.6325C41.1993 27 41.9827 27 42.4639 26.3904C42.9453 25.7808 42.7538 25.2017 42.3707 24.0434C41.207 20.5252 38.0246 18 34.2812 18Z"></path>
    <path fill="#FFB672" d="M18 36H17.25C16.0074 36 15 34.9926 15 33.75C15 32.5074 16.0074 31.5 17.25 31.5H29.0916C29.6839 31.5 30.263 31.6754 30.7557 32.0039L33.668 33.9453C34.1718 34.2812 34.8282 34.2812 35.332 33.9453L38.2443 32.0039C38.7371 31.6754 39.3161 31.5 39.9084 31.5H42.75C43.9926 31.5 45 32.5074 45 33.75C45 34.9926 43.9926 36 42.75 36H42M18 36L18.6479 38.5914C19.1487 40.5947 20.9486 42 23.0135 42H36.9865C39.0514 42 40.8513 40.5947 41.3521 38.5914L42 36M18 36H28.5ZM42 36H39.75Z"></path>
    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.25" stroke="#FF8413" d="M18 36H17.25C16.0074 36 15 34.9926 15 33.75C15 32.5074 16.0074 31.5 17.25 31.5H29.0916C29.6839 31.5 30.263 31.6754 30.7557 32.0039L33.668 33.9453C34.1718 34.2812 34.8282 34.2812 35.332 33.9453L38.2443 32.0039C38.7371 31.6754 39.3161 31.5 39.9084 31.5H42.75C43.9926 31.5 45 32.5074 45 33.75C45 34.9926 43.9926 36 42.75 36H42M18 36L18.6479 38.5914C19.1487 40.5947 20.9486 42 23.0135 42H36.9865C39.0514 42 40.8513 40.5947 41.3521 38.5914L42 36M18 36H28.5M42 36H39.75"></path>
    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="3" stroke="#FF8413" d="M34.512 22.5H34.4982"></path>
    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.25" stroke="#FF8413" d="M27.75 21.75L26.25 23.25"></path>
    </svg>
            <div>
              <span>Cheese Burger</span>
              <p>Extra Spicy</p>
              <p>No mayo</p>
            </div>
            <div class="quantity">
              <button>
                <svg fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#47484b" d="M20 12L4 12"></path>
                </svg>
              </button>
              <label>2</label>
              <button>
                <svg fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#47484b" d="M12 4V20M20 12H4"></path>
                </svg>
              </button>
            </div>
            <label class="price small">$23.99</label>
          </div>
        </div>
      </div>
    
      <div class="card coupons">
        <label class="title">Apply coupons</label>
        <form class="form">
            <input type="text" placeholder="Apply your coupons here" class="input_field">
            <button>Apply</button>
        </form>
      </div>
    
      <div class="card checkout">
        <label class="title">Checkout</label>
        <div class="details">
          <span>Your cart subtotal:</span>
          <span>47.99$</span>
          <span>Discount through applied coupons:</span>
          <span>3.99$</span>
          <span>Shipping fees:</span>
          <span>4.99$</span>
        </div>
        <div class="checkout--footer">
          <label class="price"><sup>$</sup>57.99</label>
          <button class="checkout-btn">Checkout</button>
        </div>
      </div>
    </div>

**css:**

    .master-container {
      display: grid;
      grid-template-columns: auto;
      gap: 5px;
    }
    
    .card {
      width: 400px;
      background: #FFFFFF;
      box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
    }
    
    .title {
      width: 100%;
      height: 40px;
      position: relative;
      display: flex;
      align-items: center;
      padding-left: 20px;
      border-bottom: 1px solid #efeff3;
      font-weight: 700;
      font-size: 11px;
      color: #63656b;
    }
    
    /* cart */
    .cart {
      border-radius: 19px 19px 7px 7px;
    }
    
    .cart .products {
      display: flex;
      flex-direction: column;
      padding: 10px;
    }
    
    .cart .products .product {
      display: grid;
      grid-template-columns: 60px 1fr 80px 1fr;
      gap: 10px;
    }
    
    .cart .products .product span {
      font-size: 13px;
      font-weight: 600;
      color: #47484b;
      margin-bottom: 8px;
      display: block;
    }
    
    .cart .products .product p {
      font-size: 11px;
      font-weight: 600;
      color: #7a7c81;
    }
    
    .cart .quantity {
      height: 30px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      margin: auto;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 7px;
      filter: drop-shadow(0px 1px 0px #efefef)
        drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    }
    
    .cart .quantity label {
      width: 20px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 2px;
      font-size: 15px;
      font-weight: 700;
      color: #47484b;
    }
    
    .cart .quantity button {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      outline: none;
      background-color: transparent;
      padding-bottom: 2px;
    }
    
    .card .small {
      font-size: 15px;
      margin: 0 0 auto auto;
    }
    
    .card .small sup {
      font-size: px;
    }
    
    /* coupons */
    .coupons {
      border-radius: 7px;
    }
    
    .coupons form {
      display: grid;
      grid-template-columns: 1fr 80px;
      gap: 10px;
      padding: 10px;
    }
    
    .input_field {
      width: auto;
      height: 36px;
      padding: 0 0 0 12px;
      border-radius: 5px;
      outline: none;
      border: 1px solid #e5e5e5;
      filter: drop-shadow(0px 1px 0px #efefef)
        drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
      transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    }
    
    .input_field:focus {
      border: 1px solid transparent;
      box-shadow: 0px 0px 0px 2px #242424;
      background-color: transparent;
    }
    
    .coupons form button {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10px 18px;
      gap: 10px;
      width: 100%;
      height: 36px;
      background: linear-gradient(180deg, #4480FF 0%, #115DFC 50%, #0550ED 100%);
      box-shadow: 0px 0.5px 0.5px #EFEFEF, 0px 1px 0.5px rgba(239, 239, 239, 0.5);
      border-radius: 5px;
      border: 0;
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 15px;
      color: #ffffff;
    }
    
    /* Checkout */
    .checkout {
      border-radius: 9px 9px 19px 19px;
    }
    
    .checkout .details {
      display: grid;
      grid-template-columns: 3fr 1fr;
      padding: 10px;
      gap: 5px;
    }
    
    .checkout .details span {
      font-size: 13px;
      font-weight: 600;
    }
    
    .checkout .details span:nth-child(odd) {
      font-size: 11px;
      font-weight: 700;
      color: #707175;
      margin: auto auto auto 0;
    }
    
    .checkout .details span:nth-child(even) {
      font-size: 13px;
      font-weight: 600;
      color: #47484b;
      margin: auto 0 auto auto;
    }
    
    .checkout .checkout--footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 10px 10px 20px;
      background-color: #efeff3;
    }
    
    .price {
      position: relative;
      font-size: 22px;
      color: #2B2B2F;
      font-weight: 900;
    }
    
    .price sup {
      font-size: 13px;
    }
    
    .price sub {
      width: fit-content;
      position: absolute;
      font-size: 11px;
      color: #5F5D6B;
      bottom: 5px;
      display: inline-block;
    }
    
    .checkout .checkout-btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 150px;
      height: 36px;
      background: linear-gradient(180deg, #4480FF 0%, #115DFC 50%, #0550ED 100%);
      box-shadow: 0px 0.5px 0.5px #EFEFEF, 0px 1px 0.5px rgba(239, 239, 239, 0.5);
      border-radius: 7px;
      border: 0;
      outline: none;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    }

## Otp View:

**Html:**

    <form class="otp-Form">
     
      <span class="mainHeading">Enter OTP</span>
      <p class="otpSubheading">We have sent a verification code to your mobile number</p>
      <div class="inputContainer">
       <input required="required" maxlength="1" type="text" class="otp-input" id="otp-input1">
       <input required="required" maxlength="1" type="text" class="otp-input" id="otp-input2">
       <input required="required" maxlength="1" type="text" class="otp-input" id="otp-input3">
       <input required="required" maxlength="1" type="text" class="otp-input" id="otp-input4"> 
       
      </div>
       <button class="verifyButton" type="submit">Verify</button>
         <button class="exitBtn">×</button>
         <p class="resendNote">Didn't receive the code? <button class="resendBtn">Resend Code</button></p>
         
    </form>


**css:**

    .otp-Form {
      width: 230px;
      height: 300px;
      background-color: rgb(255, 255, 255);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 30px;
      gap: 20px;
      position: relative;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.082);
      border-radius: 15px;
    }
    
    .mainHeading {
      font-size: 1.1em;
      color: rgb(15, 15, 15);
      font-weight: 700;
    }
    
    .otpSubheading {
      font-size: 0.7em;
      color: black;
      line-height: 17px;
      text-align: center;
    }
    
    .inputContainer {
      width: 100%;
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;
      justify-content: center;
    }
    
    .otp-input {
      background-color: rgb(228, 228, 228);
      width: 30px;
      height: 30px;
      text-align: center;
      border: none;
      border-radius: 7px;
      caret-color: rgb(127, 129, 255);
      color: rgb(44, 44, 44);
      outline: none;
      font-weight: 600;
    }
    
    .otp-input:focus,
    .otp-input:valid {
      background-color: rgba(127, 129, 255, 0.199);
      transition-duration: .3s;
    }
    
    .verifyButton {
      width: 100%;
      height: 30px;
      border: none;
      background-color: rgb(127, 129, 255);
      color: white;
      font-weight: 600;
      cursor: pointer;
      border-radius: 10px;
      transition-duration: .2s;
    }
    
    .verifyButton:hover {
      background-color: rgb(144, 145, 255);
      transition-duration: .2s;
    }
    
    .exitBtn {
      position: absolute;
      top: 5px;
      right: 5px;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.171);
      background-color: rgb(255, 255, 255);
      border-radius: 50%;
      width: 25px;
      height: 25px;
      border: none;
      color: black;
      font-size: 1.1em;
      cursor: pointer;
    }
    
    .resendNote {
      font-size: 0.7em;
      color: black;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    
    .resendBtn {
      background-color: transparent;
      border: none;
      color: rgb(127, 129, 255);
      cursor: pointer;
      font-size: 1.1em;
      font-weight: 700;
    }

## Message:

**html:**

    <div class="notifications-container">
      <div class="success">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="succes-svg">
              <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fill-rule="evenodd"></path>
            </svg>
          </div>
          <div class="success-prompt-wrap">
            <p class="success-prompt-heading">
              Why couldn't the bicycle stand up by itself?
            </p>
            <div class="success-prompt-prompt">
              <p>It was two-tired.</p>
            </div>
            <div class="success-button-container">
              <button class="success-button-main" type="button">
                View more Dad Jokes
              </button>
              <button class="success-button-secondary" type="button">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

**css:**


    .notifications-container {
      width: 320px;
      height: auto;
      font-size: 0.875rem;
      line-height: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .flex {
      display: flex;
    }
    
    .flex-shrink-0 {
      flex-shrink: 0;
    }
    
    .success {
      padding: 1rem;
      border-radius: 0.375rem;
      background-color: rgb(240 253 244);
    }
    
    .succes-svg {
      color: rgb(74 222 128);
      width: 1.25rem;
      height: 1.25rem;
    }
    
    .success-prompt-wrap {
      margin-left: 0.75rem;
    }
    
    .success-prompt-heading {
      font-weight: bold;
      color: rgb(22 101 52);
    }
    
    .success-prompt-prompt {
      margin-top: 0.5rem;
      color: rgb(21 128 61);
    }
    
    .success-button-container {
      display: flex;
      margin-top: 0.875rem;
      margin-bottom: -0.375rem;
      margin-left: -0.5rem;
      margin-right: -0.5rem;
    }
    
    .success-button-main {
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      background-color: #ECFDF5;
      color: rgb(22 101 52);
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-weight: bold;
      border-radius: 0.375rem;
      border: none
    }
    
    .success-button-main:hover {
      background-color: #D1FAE5;
    }
    
    .success-button-secondary {
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      margin-left: 0.75rem;
      background-color: #ECFDF5;
      color: #065F46;
      font-size: 0.875rem;
      line-height: 1.25rem;
      border-radius: 0.375rem;
      border: none;
    }

