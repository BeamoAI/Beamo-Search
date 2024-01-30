## License Overview
This GitHub project, Beamo Search, is licensed under the Creative Commons Attribution-NonCommercial (CC BY-NC) license. This allows for personal use, modification, and distribution of this software, as long as it is not for commercial purposes. You must also credit "Beamo" as the original creator. For full license details, see [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).

## Introduction
This guide outlines the steps for setting up Beamo Search, the world's smartest search engine. It's designed to be easily set up on a Debian-based system or a Windows 10/11 system.

[Debian-Based System Setup](#line-10)
[Windows 10/11 Setup](#line-167).

# Beamo Search Setup Guide For Debian-Based Systems

## Prerequisites For This Specific Setup
- A Debian-based system with `sudo` privileges.
- Access to the terminal/command line.
- Git installed on your system. (It should be installed by default on all Debian-based Systems)

### Clone Beamo Search Repository
First, clone the Beamo Search repository from GitHub:
```bash
git clone https://github.com/BeamoAI/Beamo-Search.git
```

### Update Package Lists, Install Apache2, Remove Old PHP Versions, and install PHP 8.1
```bash
sudo apt update
sudo apt install apache2
sudo apt-get purge 'php*'
sudo apt-get autoremove
sudo apt install php8.1 php8.1-curl libapache2-mod-php8.1
```

### Adjust the Firewall
```bash
sudo ufw status verbose
sudo ufw allow 80
sudo ufw allow 443
sudo ufw status verbose
```

### Enable PHP and Apache2 Modules
```bash
sudo a2enmod php8.1
sudo a2enmod rewrite
sudo a2enmod env
sudo a2enmod headers
sudo a2enmod ssl
sudo phpenmod curl
```

### Configure Virtual Hosts and Apache
```bash
sudo mv Beamo-Search/000-default.conf /etc/apache2/sites-available/
sudo mv Beamo-Search/default-ssl.conf /etc/apache2/sites-available/
sudo mv Beamo-Search/apache2.conf /etc/apache2
sudo mv Beamo-Search/envvars /etc/apache2
sudo a2ensite 000-default.conf
sudo a2ensite default-ssl.conf
```

### Move The Default Self-Signed SSL Certificate to The Proper File Path
```bash
sudo mv Beamo-Search/ca.pem /etc/apache2
```

### Delete Unnecessary Windows Conf File as This is The Debian Version

```bash
sudo rm Beamo-Search/httpd.conf
```

### Sign Up For Your Own API Keys
Sign up for your own API keys and configure them inside of the `envvars` file. Links for API signups:

1. [Anthropic API](https://console.anthropic.com/login)
2. [Bing Search API](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api)
3. [Anyscale Endpoints API](https://app.endpoints.anyscale.com/welcome)
4. [IP API (Geolocation Key) Sign Up](https://members.ip-api.com/)
5. [Timezonedb API Sign Up](https://timezonedb.com/register)

For Anthropic, you can just sign up for a free, personal API key, you can use a free Azure credit for the Bing Search API, you can use the free 1 million tokens within the first 30 days of sign-up for Anyscale, and then IP API, and Timezonedb are free.

### Configure API Keys Inside of envvars
```bash
sudo nano /etc/apache2/envvars
```

### Move Contents of Beamo-Search Folder to Apache Root Directory
```bash
sudo mv Beamo-Search/* /var/www/html/
sudo rm -r Beamo-Search
```

### Restart Apache2
```bash
sudo systemctl restart apache2
```

### Navigate to Beamo Search on localhost using HTTPS

`https://localhost`


Or gather the public IP address if you have properly configured your internet connection and computer settings and navigate there if you would like to. Instructions on how to configure your computer settings are below if you would like this to be on the public internet.

```bash
curl -s ifconfig.me
```

Navigate to the returned IP address.

### Configure HTTPS (Optional)

## You Should Only Do This If You Would Like To Host Beamo Search On The Public Internet

To configure HTTPS for secure communication, you will need to generate an SSL certificate and a private key. Below are the instructions to create a PEM file named `ca.pem`, containing both the private key and the certificate, and store it in the `/etc/apache2` directory. The self-signed certificate already works but if you want to generate your own, here is the guide. (You will need to have a URL domain in order for SSL to truly be enabled).

1. **Install OpenSSL**:
   Ensure OpenSSL is installed on your server. You can install it using the following command if it's not already installed:
   ```bash
   sudo apt-get install openssl
   ```

2. **Generate a Private Key and Certificate**:
   Use the following command to generate a new private key (`private.key`) and a certificate (`certificate.crt`) valid for 365 days:

   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout private.key -out certificate.crt -days 365 -nodes
   ```

   During the process, you will be prompted to enter information for the certificate such as country, state, organization, etc. Fill these out as appropriate for your organization or website.

3. **Combine Private Key and Certificate into ca.pem**:
   Concatenate the private key and certificate into a single PEM file named `ca.pem`:

   ```bash
   cat private.key certificate.crt > ca.pem
   ```

4. **Move ca.pem to /etc/apache2**:
   Move the `ca.pem` file to the `/etc/apache2` directory for secure storage:

   ```bash
   sudo mv ca.pem /etc/apache2/
   ```

5. **Configure Apache to Use ca.pem**:
   Update your Apache SSL configuration to use the `ca.pem` file. You will need to update the `SSLCertificateFile` and `SSLCertificateKeyFile` directives in your Apache virtual host configuration:

   Example:
   ```
   SSLCertificateFile /etc/apache2/ca.pem
   SSLCertificateKeyFile /etc/apache2/ca.pem
   ```

6. **Restart Apache**:
   After updating the Apache configuration, restart Apache to apply the changes:

   ```bash
   sudo systemctl restart apache2
   ```

7. **Security Note**:
   - Ensure that the `ca.pem` file in the `/etc/apache2` directory is kept secure and is only accessible by the root user or the Apache process.
   - Regularly renew your SSL certificates and keep your OpenSSL version updated and make sure that they do not expire.


# Beamo Search Setup Guide for Windows

## Prerequisites
- A Windows 10/11 system
- Administrative privileges on your system

### Enable Windows Subsystem for Linux (WSL)
1. Open PowerShell as Administrator and run:
   ```powershell
   wsl --install
   ```
   ![Running Powershell As Administrator](/images/Powershellrunasadministrator.jpeg)


2. Restart your computer if required.
3. If it does not open after installing, try opening the `Ubuntu` app on your computer and then it should work. If you encounter further issues after this, post an issue in the `issues` tab.

### Initial Setup for Ubuntu
1. Upon first launch, you'll be prompted to create a user and password for Ubuntu.
2. Update all the packages for reliability
   ```bash
   sudo apt update && sudo apt upgrade
   ```

### Clone Beamo Search Repository
```bash
git clone https://github.com/BeamoAI/Beamo-Search.git
```

### Update Package Lists, Install Apache2, Remove Old PHP Versions, and install PHP 8.1
```bash
sudo apt update
sudo apt install apache2
sudo apt-get purge 'php*'
sudo apt-get autoremove
sudo apt install php8.1 php8.1-curl libapache2-mod-php8.1
```

### Enable PHP and Apache2 Modules
```bash
sudo a2enmod php8.1
sudo a2enmod rewrite
sudo a2enmod env
sudo a2enmod headers
sudo a2enmod ssl
sudo phpenmod curl
```

### Configure Virtual Hosts and Apache
```bash
sudo mv Beamo-Search/000-default.conf /etc/apache2/sites-available/
sudo mv Beamo-Search/default-ssl.conf /etc/apache2/sites-available/
sudo mv Beamo-Search/apache2.conf /etc/apache2
sudo mv Beamo-Search/envvars /etc/apache2
sudo a2ensite 000-default.conf
sudo a2ensite default-ssl.conf
```

### Move The Default Self-Signed SSL Certificate to The Proper File Path
```bash
sudo mv Beamo-Search/ca.pem /etc/apache2
```

### Configure API Keys Inside of envvars With Your Own API Keys
```bash
sudo nano /etc/apache2/envvars
```

These are the links where you can grab your API keys for each service:

1. [Anthropic API](https://console.anthropic.com/login)
2. [Bing Search API](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api)
3. [Anyscale Endpoints API](https://app.endpoints.anyscale.com/welcome)
4. [IP API (Geolocation Key) Sign Up](https://members.ip-api.com/)
5. [Timezonedb API Sign Up](https://timezonedb.com/register)

For Anthropic, you can just sign up for a free, personal API key, you can use a free Azure credit for the Bing Search API, you can use the free 1 million tokens within the first 30 days of sign-up for Anyscale, and then IP API, and Timezonedb are free.

### Move Contents of Beamo-Search Folder to Apache Root Directory
```bash
sudo mv Beamo-Search/* /var/www/html/
sudo rm -r Beamo-Search
```

### Restart Apache2
```bash
sudo systemctl restart apache2
```

### Navigate to Beamo Search on localhost using HTTPS

`https://localhost`


Or gather the public IP address if you have properly configured your internet connection and computer settings and navigate there if you would like to. Instructions on how to configure your computer settings are below if you would like this to be on the public internet.

```bash
curl -s ifconfig.me
```

Navigate to the returned IP address.

### Adjust the Firewall (Optional)

## You Should Only Do This If You Would Like To Host Beamo Search On The Public Internet

1. **Open PowerShell as Administrator**:
   - Click on the Start menu, type `PowerShell`.
   - Right-click on `Windows PowerShell` and select `Run as administrator`.
   - If prompted by User Account Control (UAC), click `Yes` to allow PowerShell to run with administrative privileges.

   ![Running Powershell As Administrator](/images/Powershellrunasadministrator.jpeg)

2. **Create Inbound Rule for HTTP (Port 80)**:
   - In the PowerShell window, enter the following command to allow inbound HTTP traffic on port 80:
     ```powershell
     New-NetFirewallRule -DisplayName "Beamo Search Inbound HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
     ```

3. **Create Inbound Rule for HTTPS (Port 443)**:
   - Similarly, enter this command to allow inbound HTTPS traffic on port 443:
     ```powershell
     New-NetFirewallRule -DisplayName "Beamo Search Inbound HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
     ```

4. **Create Outbound Rule for HTTP (Port 80)**:
   - Enter the following command to allow outbound HTTP traffic on port 80:
     ```powershell
     New-NetFirewallRule -DisplayName "Beamo Search Outbound HTTP" -Direction Outbound -Protocol TCP -LocalPort 80 -Action Allow
     ```

5. **Create Outbound Rule for HTTPS (Port 443)**:
   - Enter this command to allow outbound HTTPS traffic on port 443:
     ```powershell
     New-NetFirewallRule -DisplayName "Beamo Search Outbound HTTPS" -Direction Outbound -Protocol TCP -LocalPort 443 -Action Allow
     ```

6. **Verification**:
   - You can verify the new rules have been added by going to Control Panel > System and Security > Windows Defender Firewall > Advanced Settings. 
   - Check both "Inbound Rules" and "Outbound Rules" for "Beamo Search Inbound HTTP", "Beamo Search Inbound HTTPS", "Beamo Search Outbound HTTP", and "Beamo Search Outbound HTTPS".

   ![Opening Control Panel](/images/controlpannelscreenshot.jpeg)
   ![Opening System and Security](/images/SystemandSecurityScreenshot.jpeg)
   ![Opening Windows Defender Firewall](/images/Defenderscreenshot.jpeg)
   ![Opening Advanced Settings](/images/AdvancedSettingsScreenshot.jpeg)
   ![Viewing Inbound Rules](/images/InboundFirewallRules.jpeg)
   ![Viewing Outbound Rules](/images/Outboundrulesscreenshot.jpeg)

   If these rules are present, the firewall has been configured successfully.

### Configure HTTPS (Optional)

## You Should Only Do This If You Would Like To Host Beamo Search On The Public Internet

To configure HTTPS for secure communication, you will need to generate an SSL certificate and a private key. Below are the instructions to create a PEM file named `ca.pem`, containing both the private key and the certificate, and store it in the `/etc/apache2` directory. The self-signed certificate already works but if you want to generate your own, here is the guide. (You will need to have a URL domain in order for SSL to truly be enabled).

1. **Install OpenSSL**:
   Ensure OpenSSL is installed on your server. You can install it using the following command if it's not already installed:
   ```bash
   sudo apt-get install openssl
   ```

2. **Generate a Private Key and Certificate**:
   Use the following command to generate a new private key (`private.key`) and a certificate (`certificate.crt`) valid for 365 days:

   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout private.key -out certificate.crt -days 365 -nodes
   ```

   During the process, you will be prompted to enter information for the certificate such as country, state, organization, etc. Fill these out as appropriate for your organization or website.

3. **Combine Private Key and Certificate into ca.pem**:
   Concatenate the private key and certificate into a single PEM file named `ca.pem`:

   ```bash
   cat private.key certificate.crt > ca.pem
   ```

4. **Move ca.pem to /etc/apache2**:
   Move the `ca.pem` file to the `/etc/apache2` directory for secure storage:

   ```bash
   sudo mv ca.pem /etc/apache2/
   ```

5. **Configure Apache to Use ca.pem**:
   Update your Apache SSL configuration to use the `ca.pem` file. You will need to update the `SSLCertificateFile` and `SSLCertificateKeyFile` directives in your Apache virtual host configuration:

   Example:
   ```
   SSLCertificateFile /etc/apache2/ca.pem
   SSLCertificateKeyFile /etc/apache2/ca.pem
   ```

6. **Restart Apache**:
   After updating the Apache configuration, restart Apache to apply the changes:

   ```bash
   sudo systemctl restart apache2
   ```

7. **Security Note**:
   - Ensure that the `ca.pem` file in the `/etc/apache2` directory is kept secure and is only accessible by the root user or the Apache process.
   - Regularly renew your SSL certificates and keep your OpenSSL version updated and make sure that they do not expire.

By following these steps, you will have configured HTTPS for your Apache server using a self-signed certificate stored as `ca.pem` in the `/etc/apache2` directory. This is suitable for testing and development purposes. For a production environment, consider obtaining a certificate from a trusted certificate authority (CA).