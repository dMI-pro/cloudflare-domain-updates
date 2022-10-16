## PB-CLI-ACTIONS

The purpose of the application is to add and remove a domain or lists of domains in CloudFlare.com. Add, update and remove dns records for a domain.

The tool supports triggering the services either using `argv` arguments - We will go through it in the next sections.

### Prerequisites (CLI)
You need to set up environment variables. The .env.example file contains the test data.
To work with your account in cloudflare.com, needs to be corrected for your data:
- `CF_API_EMAIL` - mail/login cloudFlare account;
- `CF_API_KEY` - authorization key (from cloudFlare personal account).

### How to run services

#### Command line interface

1. Working with domain names.

Command variation example:

`npm start add/delete json/csv/xlsx/name_domain`

1.1 Adding or deleting a one domain:

`npm start add projectfinew.xyz`

1.2 Adding or deleting a list of domains using files:
- JSON file structure array of string;
- CSV and XLSX file structure first line header "domain", each new line is the name of the domain.

`npm start delete csv`

The file must be in the Source folder with the name list and extension depending on the type .json/.csv/.xlsx. Example list.csv.


2. Work with dns records.

Command variation example:

`npm start add/update/delete domain_name chosen_name_dns_record type_dns content_dns ttl_dns priority_dns proxied_dns`

Required parameters:
- `domain_name` - name domain;
- `chosen_name_dns_record` - dns record name;
- `type_dns`- record type ("A", "AAAA", "CNAME");
- `content_dns` - DNS record content(IP or URl).

Optional parameters:
- `ttl_dns`- Time to live, in seconds, of the DNS record. Must be between 60 and 86400, or 1 for 'automatic';
- `priority_dns` - Required for MX, SRV and URI records; unused by other record types. Records with lower priorities are preferred;
- `proxied_dns`-Whether the record is receiving the performance and security benefits of Cloudflare.

if you do not specify Optional parameters, the default values ​​will be substituted. You can only omit the last parameter on a line, but you can't omit any optional
 parameter.

2.1 Adding new dns record for domain: 

`npm start add projectfinew.xyz A test_dns_record 162.255.119.243 1 10 true`

2.2 Update dns record for domain:

`npm start update projectfinew.xyz test_dns_record A example_dns_record 162.255.119.243 1 10 true`

2.3 delete dns record for domain:

`npm start delete projectfinew.xyz example_dns_record`

