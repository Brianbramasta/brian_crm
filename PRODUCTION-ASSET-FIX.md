# 🚨 Production Asset Loading Issue - Troubleshooting Guide

## Current Issue

```
GET https://test-crm.brianaldybramasta.my.id/frontend/assets/js/index-25f7e6c5.js
net::ERR_ABORTED 404 (Not Found)
```

The server is trying to load `index-25f7e6c5.js` but your actual file is `index-528e8f55.js`.

## 🔍 Step-by-Step Debugging

### Step 1: Use Debug Mode

1. Upload `debug-react-app.blade.php` to your cPanel: `/resources/views/`
2. Upload the updated `web.php` to your cPanel: `/routes/`
3. Visit: `https://test-crm.brianaldybramasta.my.id/debug-assets`
4. Check what files are actually detected on the server

### Step 2: Verify File Structure on cPanel

Make sure your cPanel has this exact structure:

```
public_html/
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── index-528e8f55.css (or similar)
│   │   └── js/
│   │       ├── index-528e8f55.js
│   │       ├── vendor-51280515.js
│   │       ├── router-902ffa71.js
│   │       └── utils-63a63872.js
│   └── index.html
├── index.php
└── (other Laravel files...)
```

### Step 3: Clear All Caches

Run these commands on your cPanel (if you have terminal access):

```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

Or delete these cache directories manually:

-   `bootstrap/cache/`
-   `storage/framework/cache/`
-   `storage/framework/views/`

### Step 4: Verify Template Upload

Make sure you uploaded the LATEST version of `react-app.blade.php` to:

```
/resources/views/react-app.blade.php
```

### Step 5: Build and Upload Fresh Assets

On your local machine:

```bash
cd frontend
npm run build
```

Then upload EVERYTHING from `public/frontend/` to your cPanel's `public_html/frontend/` directory.

## 🔧 Quick Fixes

### Fix 1: Force Template Refresh

Temporarily rename your blade template to force Laravel to reload it:

1. Rename `react-app.blade.php` to `react-app-new.blade.php`
2. Update your routes to use `react-app-new`
3. Upload to cPanel

### Fix 2: Manual Asset Check

Create a simple test file on your cPanel at `public_html/test-assets.php`:

```php
<?php
$frontendPath = __DIR__ . '/frontend/assets';
echo "<h2>Asset Check</h2>";
echo "<p>Frontend path: " . $frontendPath . "</p>";
echo "<p>Directory exists: " . (is_dir($frontendPath) ? 'Yes' : 'No') . "</p>";

if (is_dir($frontendPath . '/js')) {
    $jsFiles = glob($frontendPath . '/js/*.js');
    echo "<h3>JS Files Found:</h3>";
    foreach ($jsFiles as $file) {
        echo "<p>" . basename($file) . "</p>";
    }
} else {
    echo "<p>JS directory not found!</p>";
}
?>
```

Visit: `https://test-crm.brianaldybramasta.my.id/test-assets.php`

### Fix 3: Hardcode Asset Names (Temporary)

If dynamic loading fails, temporarily hardcode the correct filenames in your blade template:

```html
<script
    type="module"
    crossorigin
    src="{{ asset('frontend/assets/js/index-528e8f55.js') }}"
    defer
></script>
<link
    rel="modulepreload"
    crossorigin
    href="{{ asset('frontend/assets/js/vendor-51280515.js') }}"
/>
<link
    rel="modulepreload"
    crossorigin
    href="{{ asset('frontend/assets/js/router-902ffa71.js') }}"
/>
<link
    rel="modulepreload"
    crossorigin
    href="{{ asset('frontend/assets/js/utils-63a63872.js') }}"
/>
<link
    rel="stylesheet"
    href="{{ asset('frontend/assets/css/index-1d875b6d.css') }}"
/>
```

## ⚠️ Common Issues

1. **Wrong File Permissions**: Ensure files have correct permissions (644 for files, 755 for directories)
2. **Incomplete Upload**: Some files might not have uploaded completely
3. **Cache Issues**: Old cached templates might be served
4. **Path Issues**: Double-check that paths match exactly

## 🎯 Most Likely Solution

Based on the error, the most likely issue is:

1. Your cPanel doesn't have the updated `react-app.blade.php` file
2. Or Laravel is serving a cached version of the old template

**Immediate action**: Upload the latest `react-app.blade.php` and clear all caches.

## 📞 Emergency Fallback

If nothing works, create this minimal working template:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>PT Smart CRM</title>
        <link rel="stylesheet" href="/frontend/assets/css/index-528e8f55.css" />
    </head>
    <body>
        <div id="root"></div>
        <script
            type="module"
            src="/frontend/assets/js/index-528e8f55.js"
        ></script>
    </body>
</html>
```

Save as `react-app-simple.blade.php` and use it temporarily to get your site working.
