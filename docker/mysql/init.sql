-- PT Smart CRM Database Initialization
-- This script will be executed when the MySQL container starts for the first time

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ptsmart_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create the development database
CREATE DATABASE IF NOT EXISTS ptsmart_crm_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges to the application user
GRANT ALL PRIVILEGES ON ptsmart_crm.* TO 'ptsmart_user'@'%';
GRANT ALL PRIVILEGES ON ptsmart_crm_dev.* TO 'ptsmart_user'@'%';

-- Flush privileges to ensure they take effect
FLUSH PRIVILEGES;

-- Set some MySQL optimizations for Laravel
SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- Log that initialization is complete
SELECT 'PT Smart CRM database initialization completed' AS Status;
