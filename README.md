# Accommodation Search

## Install and run

From the project root:

```
npm install
```

### Run

Once install has finished, you can use the following to run both the API and UI:

```
npm run start
```

### API

To run the API separately, navigate to the `./packages/api` folder

```
$ cd packages/api
```

And run the `api` server with

```
$ npm run dev
```

The API should start at http://localhost:3001

### Client

To run the `client` server separately, navigate to the `./packages/client` folder

```
$ cd ./packages/client
```

And run the `client` with

```
$ npm run start
```

The UI should start at http://localhost:3000

### Running the tests
To run the tests you need to have the app running 

```
npm run start
```
For Client Tests

```
npm run test:client
```

For Server Tests

```
npm run test:server
```

### Database connection & environment variables

By default, the code is set up to start and seed a MongoDB in-memory server, which should be sufficient for the test. The database URL will be logged on startup, and the seed data can be found at ./packages/api/db/seeds.

If this setup does not work for you or if you prefer to use your own MongoDB server, you can create a .env file. In the ./packages/api folder, create a .env file (or rename the existing .env.sample) and fill in the environment variables.

### Write-up

<!-- Write-up/conclusion section -->
# Project Improvements & Enhancements 🚀

## 🔧 **Initial Issues**
Before the improvements, the project had several issues that needed to be addressed:
- ❌ Clicking the **close button** within the search field did not clear the field and results.
- ❌ **Minimal testing** in place.
- ❌ The implementation was **not optimized for search**, as it fetched all hotels without filtering.
- ❌ The API only had a **/hotels** endpoint, meaning the search was **limited to hotels** and did not include cities or countries.

---

## ✅ **Implemented Enhancements**
I have improved the project by making the **hotel search application more efficient, user-friendly, and scalable**.

### 🔍 **1. Unified Search Across Hotels, Cities, and Countries**
- 🏨 **Before:** The search was limited to hotels via the `/hotels` endpoint.
- 🚀 **Now:** A **single `/search` endpoint** efficiently retrieves results across **hotels, cities, and countries**, making the search experience more **comprehensive and intuitive**.

### 🎯 **2. Enhanced Filtering Capabilities**
- ✅ Users can now **filter hotels by location**, enabling targeted searches for accommodations in specific countries.
- ✅ This improves **usability**, ensuring users find relevant results **more quickly**.

### ⚡ **3. Optimized Search Performance**
- 🔍 Implemented **partial matching**, allowing users to find relevant results **even with incomplete queries**.
- ⏳ **Debounced search requests** reduce unnecessary API calls, **improving performance and responsiveness**.

### 🏎️ **4. Backend Performance Improvements**
- 🚀 **Rate Limiting**: Added a **rate limiter** to prevent excessive API requests, improving **security** and protecting against abuse.
- ⚡ **Caching**: Implemented **server-side caching** for repeated search queries, reducing **database load** and significantly improving response times.

### 🖥️ **5. Improved User Experience**
- 🎨 The **search bar UI dynamically updates results** in real-time, offering a **smooth and interactive search experience**.
- 🔗 Clicking on a result now **redirects to a detailed page** for the selected **hotel, city, or country**, improving **navigation**.
- ✨ The pages are now **consistent in design across the app**, making it **more user-friendly**.

### 🏗️ **6. Improved Code Maintainability & Scalability**
- ✅ **Backend:** The code structure is now **modular**, making it easier to extend and maintain.
- ✅ **Frontend:** The **reactive search component** is **reusable and adaptable** for future enhancements.

---

## 🚀 **Final Impact**
These improvements significantly enhance:
- 📈 **Scalability**: Easier to add **new search filters** (e.g., ratings, price range).
- ⚡ **Performance**: More **efficient queries** and **better API response times**.
- 🏅 **User Engagement**: A **faster, cleaner, and more intuitive search experience**.
- 🏆 **Security & Stability**: The **rate limiter** prevents API overuse, ensuring **reliable performance** under high traffic.

With these changes, the project is now **more robust, scalable, and user-friendly**, setting a **solid foundation for future growth**. 🎉

### Database structure

#### Hotels Collection

```json
[
  {
    "chain_name": "Samed Resorts Group",
    "hotel_name": "Sai Kaew Beach Resort",
    "addressline1": "8/1 Moo 4 Tumbon Phe Muang",
    "addressline2": "",
    "zipcode": "21160",
    "city": "Koh Samet",
    "state": "Rayong",
    "country": "Thailand",
    "countryisocode": "TH",
    "star_rating": 4
  },
  {
    /* ... */
  }
]
```

#### Cities Collection

```json
[
  { "name": "Auckland" },
  {
    /* ... */
  }
]
```

#### Countries Collection

```json
[
  {
    "country": "Belgium",
    "countryisocode": "BE"
  },
  {
    /* ... */
  }
]
```
