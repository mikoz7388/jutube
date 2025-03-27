"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { newRelicConfig } from "@/lib/new-relic-config";

export function NewRelicBrowser() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Rest of your code
  }, [scriptLoaded, pathname, searchParams]);

  const handleScriptLoad = () => {
    console.log("📝 New Relic script załadowany");
    setScriptLoaded(true);
  };

  return (
    <>
      <Script
        id="newrelic-browser"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      >
        {`
          (function(w,d,s,l,i){
            w.newrelic=w.NREUM={};
            w.NREUM.init={privacy:{cookies_enabled:true},distributed_tracing:{enabled:true},ajax:{deny_list:["bam.eu01.nr-data.net"]}};
            w.NREUM.loader_config=${JSON.stringify(newRelicConfig)};
            w.NREUM.info={beacon:"bam.eu01.nr-data.net",errorBeacon:"bam.eu01.nr-data.net",licenseKey:"${newRelicConfig.licenseKey}",applicationID:"${newRelicConfig.applicationID}",sa:1};
            
            var n=d.createElement(s),r=d.getElementsByTagName(s)[0];
            n.async=1;n.src="https://js-agent.newrelic.com/nr-spa-1.285.0.min.js";
            r.parentNode.insertBefore(n,r);
          })(window,document,'script');
        `}
      </Script>
    </>
  );
}
