-- MySQL initialization script for PTSmart CRM
-- This script runs when the MySQL container is first created

-- Create additional databases if needed
CREATE DATABASE IF NOT EXISTS ptsmart_crm_test;

-- Grant privileges to the application user
GRANT ALL PRIVILEGES ON ptsmart_crm.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON ptsmart_crm_test.* TO 'root'@'%';

-- Create a dedicated user for the application
CREATE USER IF NOT EXISTS 'ptsmart_user'@'%' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON ptsmart_crm.* TO 'ptsmart_user'@'%';
GRANT ALL PRIVILEGES ON ptsmart_crm_test.* TO 'ptsmart_user'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;
