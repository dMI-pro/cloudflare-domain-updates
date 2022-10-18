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

`npm start domain add/delete json/csv/xlsx/name_domain`

1.1 Adding or deleting a one domain:

`npm start domain add projectfinew.xyz`

1.2 Adding or deleting a list of domains using files:
- JSON file structure array of string;
- CSV and XLSX file structure first line header "domain", each new line is the name of the domain.

`npm start domain delete csv`

The file must be in the Source folder with the name list and extension depending on the type .json/.csv/.xlsx. Example list.csv.


2. Work with dns records.

Command variation example:

`npm start dns add/update/delete domain_name chosen_name_dns_record type_dns name_dns_record content_dns ttl_dns proxied_dns priority_dns`

Required parameters:
- `domain_name` - name domain;
- `chosen_name_dns` - dns record name to delete or update;
- `type_dns`- record type ("A", "AAAA", "CNAME");
- `name_dns` - DNS record name.
- `content_dns` - DNS record content(IP or URl).
- `ttl_dns`- Time to live, in seconds, of the DNS record. Must be between 60 and 86400, or 1 for 'automatic';

Optional parameters:
- `priority_dns`- Required for MX, SRV and URI records; unused by other record types. Records with lower priorities are preferred. min value:0
  max value:65535;
- `proxied_dns`- Whether the record is receiving the performance and security benefits of Cloudflare. valid values: (true,false).

if you do not specify Optional parameters, the default values will be substituted. You can only omit the last parameter on a line, but you can't omit any optional
 parameter.

2.1 Adding new dns record for domain: 

`npm start dns add projectfinew.xyz A test 162.255.119.243 3600 true 10`

2.2 Update dns record for domain:

`npm start dns update projectfinew.xyz test cname test2 162.255.119.243 8000 true`

2.3 delete dns record for domain:

`npm start dns delete projectfinew.xyz test2`

