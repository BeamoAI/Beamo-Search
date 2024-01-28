# Beamo Search Setup Guide

## License Overview
This GitHub project, Beamo Search, is licensed under the Creative Commons Attribution-NonCommercial (CC BY-NC) license. This allows for personal use, modification, and distribution of this software, as long as it is not for commercial purposes. You must also credit "Beamo" as the original creator. For full license details, see [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).

## Introduction
This guide outlines the steps for setting up Beamo Search, a powerful search engine software. It's designed to be easily set up on a Debian-based system.

# Setup For Debian Based Systems

## Prerequisites For This Specific Setup
- A Debian-based system with `sudo` privileges.
- Access to the terminal/command line.
- Git installed on your system.

If you do not have a debian based system, get one for free at [Replit](https://repl.it) in order to run the apache2 server and make your changes on. It is possible to do it on other systems, but those are not covered in this guide and most of them are harder to get started on.

## Step-by-Step Instructions

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

### Sign Up For Your Own API Keys
Sign up for your own API keys and configure them inside of the `envvars` file. Links for API signups:

1. [Anthropic API](https://console.anthropic.com/login)
2. [Bing Search API](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api)
3. [Anyscale Endpoints API](https://app.endpoints.anyscale.com/welcome)
4. [IP API (Geolocation Key) Sign Up](https://members.ip-api.com/)
5. [Timezonedb API Sign Up](https://timezonedb.com/register)

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

### Obtain Server IP Address
```bash
curl -s ifconfig.me
``` 

To modify the instructions in your README file to generate a new PEM file named `ca.pem`, ensuring it's always stored and referenced in the `/etc/apache2` directory, you can revise the section as follows:


### Configure HTTPS (Optional)

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


Beamo Search © 2024 by Beamo LLC is licensed under Attribution-NonCommercial 4.0 International