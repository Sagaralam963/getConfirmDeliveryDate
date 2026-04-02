## Getting Started

Consume production H4HANA services in project.

##  1. Consume Service

*   Consume .edmx file or consume with the help of **service center**.
*   It will create external folder. and also configure package.json file.
*   Then add connectivity and destination instances in project like example.

```javascript
cds bind -2 pr-creation-connectivity-service:SharedDevKey
```

```javascript
cds bind -2 pr-creation-destination-service:SharedDevKey
```

*   This will create .cdsrc-private.json file in root directory

example:

```javascript
{
  "requires": {
    "[hybrid]": {
      "destinations": {
        "binding": {
          "type": "cf",
          "apiEndpoint": "https://api.cf.eu10.hana.ondemand.com",
          "org": "org Name",
          "space": "space name",
          "instance": "pr-creation-destination-service",
          "key": "SharedDevKey"
        },
        "kind": "destinations",
        "vcap": {
          "name": "destinations"
        }
      },
      "connectivity": {
        "binding": {
          "type": "cf",
          "apiEndpoint": "https://api.cf.eu10.hana.ondemand.com",
          "org": "org Name",
          "space": "space name",
          "instance": "pr-creation-connectivity-service",
          "key": "SharedDevKey"
        },
        "kind": "connectivity",
        "vcap": {
          "name": "connectivity"
        }
      }
    }
  }
}
```

*   Create service.cds and service.js file in srv folder.

Example:

**service.cds**

```cds
using ZAPI_BUSINESS_PARTNER as BP from './external/ZAPI_BUSINESS_PARTNER';

service ZAPI_BUSINESS_PARTNERSampleService {

    entity A_BusinessPartner as
        projection on BP.A_BusinessPartner {
            key BusinessPartner,
                Customer,
                Supplier,
                AcademicTitle,
                AuthorizationGroup,
                BusinessPartnerCategory,
                BusinessPartnerFullName,
                BusinessPartnerGrouping,
                BusinessPartnerName,
                BusinessPartnerUUID,
                
        };
}
```

service.js

```javascript
const cds = require('@sap/cds');

module.exports = async (srv) => {
  // Using CDS API      
  const BP = await cds.connect.to("ZAPI_BUSINESS_PARTNER");


  srv.on('READ','A_BusinessPartner', async(req)=>{

    return BP.run(req.query);

  })
}
```

*   Create .env file in root directory to configured destination for local testing

```plaintext
destinations = [{"name":"hac2build_S09","proxyHost":"http://127.0.0.1","proxyPort":"8887","url":"http://hac2build_S09.dest"}]
```

*   Add API configuration in .cdsrc-private.json file

Example:

**"ZAPI\_BUSINESS\_PARTNER": {**

 **"credentials": {**

 **"destination": "hac2build\_S09",**

 **"path": "/sap/opu/odata/sap/API\_BUSINESS\_PARTNER"**

 **}**

 **}**

*   File look like this:

```javascript
{
  "requires": {
    "[hybrid]": {
      "destinations": {
        "binding": {
          "type": "cf",
          "apiEndpoint": "https://api.cf.eu10.hana.ondemand.com",
          "org": "org Name",
          "space": "space name",
          "instance": "pr-creation-destination-service",
          "key": "SharedDevKey"
        },
        "kind": "destinations",
        "vcap": {
          "name": "destinations"
        }
      },
      "connectivity": {
        "binding": {
          "type": "cf",
          "apiEndpoint": "https://api.cf.eu10.hana.ondemand.com",
          "org": "org Name",
          "space": "space name",
          "instance": "pr-creation-connectivity-service",
          "key": "SharedDevKey"
        },
        "kind": "connectivity",
        "vcap": {
          "name": "connectivity"
        }
      },
      "ZAPI_BUSINESS_PARTNER": {
       "credentials": {
            "destination": "hac2build_S09",
            "path": "/sap/opu/odata/sap/API_BUSINESS_PARTNER"
          }
      }
    }
  }
}
```

*   Run your project and check the API.

```diff
cds watch --profile hybrid
```
