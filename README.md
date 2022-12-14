## PB-CLI-ACTIONS

The purpose of the application is to add and remove a domain or lists of domains in CloudFlare.com. Add, update and remove dns records for a domain.

The tool supports triggering the services using `argv` arguments - We will go through it in the next sections.
### Prerequisites (CLI)
You need to set up environment variables to work with your CloudFlare.com account, add your account information to the `.env.development` or `.env.production` file. Example in file `.env.example`.
- `CF_API_EMAIL` - mail/login cloudFlare account;
- `CF_API_KEY` - authorization key (from cloudFlare personal account).

### How to run services (CLI)
There are 2 launch modes for development and production applications.

Select command depending on your usage.

#### Commands to run application:
1. Standard launch with `npm start` uses development mode

`npm start domain add name_domain`

2. Command to run in development mode:

`npm run dev domain add name_domain` 

3. Command to run in production mode:

`npm run prod domain add name_domain`


#### Working with domain names:

Commands variation example:

`npm start domain add/delete json/csv/xlsx/name_domain`

1. Adding or deleting a one domain:

`npm start domain add projectfinew.xyz`

2. Adding or deleting a list of domains using files:

`npm start domain delete csv`

The file must be in the Source folder with the name list and extension depending on the type .json/.csv/.xlsx. Example list.csv. Example structure in file `list.example.xlsx`.

#### Work with dns records.

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
  max value:65535. If you do not specify this parameter, the default value is `10`;
- `proxied_dns`- Whether the record is receiving the performance and security benefits of Cloudflare. valid values: `true or false`. Default value is `true`.

if you do not specify Optional parameters, the default values will be substituted. You can only omit the last parameter on a line, but you can't omit any other parameter except the last one.

Example commands:

1. Adding new dns record for domain: 

`npm start dns add projectfinew.xyz A test 162.255.119.243 3600 true 10`

2. Update dns record for domain:

`npm start dns update projectfinew.xyz test cname test2 162.255.119.243 8000 true`

3. delete dns record for domain:

`npm start dns delete projectfinew.xyz test2`

