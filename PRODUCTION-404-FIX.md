# PT Smart CRM - 404 Reload Issue Fix Guide

## 🚨 Problem Analysis

When reloading `/dashboard` (or any React Router route) in production, you get:

-   **404 NOT FOUND** error
-   Assets not loading properly
-   React app not initializing

## ✅ Root Causes & Solutions

### **1. Server-Side Routing Issue**

**Problem:** Server tries to find physical `/dashboard` directory instead of serving React app.

**Solution:** Update `.htaccess` with proper SPA routing rules.

```apache
# Add to your .htaccess in public_html
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Serve static files directly
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # Handle API routes (send to Laravel)
    RewriteCond %{REQUEST_URI} ^/api/
    RewriteRule ^ index.php [L]

    # Handle React Router routes (SPA)
    RewriteCond %{REQUEST_URI} ^/(dashboard|leads|customers|products|deals|reports|login)(/.*)?$
    RewriteRule ^ index.php [L]

    # Default Laravel routing
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### **2. Asset Loading Issues**

**Problem:** CSS/JS files returning 404 errors.

**Solutions:**

#### A. Verify File Structure on Production:

```
public_html/
├── index.php
├── .htaccess
├── frontend/
│   └── assets/
│       ├── css/
│       │   └── index-1d875b6d.css
│       └── js/
│           └── index-25f7e6c5.js
```

#### B. Check File Permissions:

```bash
chmod 755 public_html/frontend/
chmod 755 public_html/frontend/assets/
chmod 644 public_html/frontend/assets/css/*
chmod 644 public_html/frontend/assets/js/*
```

#### C. Verify Asset URLs:

Test these URLs directly in browser:

-   `https://yourdomain.com/frontend/assets/css/index-1d875b6d.css`
-   `https://yourdomain.com/frontend/assets/js/index-25f7e6c5.js`

### **3. Laravel Configuration**

**Problem:** Laravel routes not properly configured for SPA.

**Solution:** Ensure `routes/web.php` has:

```php
<?php

use Illuminate\Support\Facades\Route;

// Route untuk mengakses aplikasi React CRM
Route::get('/', function () {
    return view('react-app');
});

// Catch-all route untuk React Router (SPA)
Route::get('/{any}', function () {
    return view('react-app');
})->where('any', '.*');
```

### **4. Blade Template Issues**

**Problem:** Template not loading assets correctly.

**Solution:** Use the debug template to identify issues:

```php
// Temporarily update routes/web.php to use debug template
Route::get('/', function () {
    return view('react-app-debug');
});

Route::get('/{any}', function () {
    return view('react-app-debug');
})->where('any', '.*');
```

## 🔧 Step-by-Step Fix Process

### **Step 1: Upload Correct Files**

1. **Build locally:**

    ```bash
    cd frontend
    npm run build
    ```

2. **Upload structure to cPanel:**

    ```
    public_html/
    ├── index.php (modified for cPanel)
    ├── .htaccess (updated with SPA rules)
    ├── frontend/ (built React assets)

    laravel_app/ (outside public_html)
    ├── app/
    ├── routes/
    ├── resources/
    └── etc...
    ```

### **Step 2: Update cPanel index.php**

```php
<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Update path to point to Laravel app outside public_html
require __DIR__.'/../laravel_app/vendor/autoload.php';

$app = require_once __DIR__.'/../laravel_app/bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
```

### **Step 3: Test & Debug**

1. **Test asset loading:**

    - Visit: `https://yourdomain.com/frontend/assets/css/index-1d875b6d.css`
    - Should return CSS content, not 404

2. **Test SPA routing:**

    - Visit: `https://yourdomain.com/dashboard`
    - Should load React app, not 404

3. **Check browser console:**
    - Look for JavaScript errors
    - Verify all assets load successfully

### **Step 4: Production Environment**

Ensure `.env` in laravel_app/ has:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

## 🐛 Common Issues & Quick Fixes

### **Issue 1: Assets still 404**

-   **Fix:** Check file permissions and path structure
-   **Command:** `chmod -R 755 public_html/frontend/`

### **Issue 2: Routes still not working**

-   **Fix:** Clear Laravel caches
-   **Commands:**
    ```bash
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
    ```

### **Issue 3: React app not initializing**

-   **Fix:** Check browser console for JavaScript errors
-   **Solution:** Use debug template to identify specific issues

### **Issue 4: CSRF token errors**

-   **Fix:** Ensure meta tag is present in template
-   **Check:** `<meta name="csrf-token" content="{{ csrf_token() }}">`

## ✅ Verification Checklist

-   [ ] Assets load directly via URL
-   [ ] React app loads on homepage
-   [ ] Dashboard route works on direct access
-   [ ] Reload on any route doesn't show 404
-   [ ] Browser console shows no errors
-   [ ] Network tab shows all assets loading (200 status)

## 🚀 Final Test

1. Clear browser cache
2. Visit `https://yourdomain.com`
3. Navigate to `/dashboard`
4. Reload page (F5)
5. Should show React app, not 404

Your React CRM should now work perfectly with SPA routing! 🎉
