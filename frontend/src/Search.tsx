const W = window as any;

const R = W.R || [];
delete W.R;

export default function Search() {
  return (
    <div className="_">
      <div className="search-render">
        <span>{W.C}</span>
        <div className="s-list">
          <h2 className="h1" style={{ display: "none"}}>Web results</h2>
          {R.map((Y: any, index: number) => (
            <div key={index} className="_0">
              <div className="_1">
                <div className="_2">
                  <a className="endpoint _3" href={Y.a2 + Y.a1} ping={`/url?source=web&url=${encodeURIComponent(Y.a2 + Y.a1)}`}>
                    <div className="_4" aria-hidden="true">
                      <img className="_5" src={Y.a4}/>
                    </div>
                    <div style={{ width: "8px" }} />
                    <div className="notranslate _6">
                      <div className="_7">{Y.a0}</div>
                      <div className="_8">{Y.a2}<span>{Y.a1?.replace(/\//g, " / ")}</span></div>
                    </div>
                 </a>
                  <a className="_9" href={Y.a2 + Y.a1} ping={`/url?source=web&url=${encodeURIComponent(Y.a2 + Y.a1)}`}>
                    <h3 className="b0">{Y.b0}</h3>
                  </a>
                  <h4 className="b1">{Y.b1}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
  //     <div className="_2" lang="en">
  //       <div className="_3">
  //         <div className="_4">
  //           <div className="_6">
  //             <div className="b8lM7">
  //               <span className="V9tjod">
  //                 <a className="endpoint _8" href={Y.a2 + Y.a1} ping={`/url?source=web&url=${encodeURIComponent(Y.a2 + Y.a1)}`}>
  //                   <span aria-hidden="true">
  //                     <span className="DDKf1c">
  //                   </span>
  //                 </span>

  //                 <div style={ { width: "8px" }} />


  //                 <div className="notranslate ESMNde HGLrXd ojE3Fb">
  //                   <h3 className="LC20lb MBeuO DKV0Md" id="_xtg2arq3OqmR1sQPqeya0QI_57">Free Favicon API - Get Any Website Favicon Instantly</h3>
  //                   <div className="q0vns">
  //                     <div className="CA5RN">
  //                       <div>
  //                         <span className="VuuXrf">{Y.a2?.replace(/(https:\/\/)|\//g, "")}</span>
  //                       </div>
  //                       <div className="byrV5b">
  //                         <cite className="qLRx3b tjvcx GvPZzd dTxz9 cHaqb" role="text">{Y.a2}<span className="" role="text">{Y.a1?.replace(/\//g, "》")}</span></cite>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </a>
  //             </span>
  //             <div className="B6fmyf byrV5b Mg1HEd">
  //               <div className="HGLrXd ojE3Fb">
  //                 <div className="q0vns">
  //                   <span aria-hidden="true"><span className="DDKf1c"><div className="eqA2re UnOTSe"></div>
  //                   </span></span><div className="CA5RN">
  //                     <div>
  //                       <span className="VuuXrf">Favicon.im</span>
  //                     </div>
  //                     <div className="byrV5b">
  //                       <cite className="qLRx3b tjvcx GvPZzd dTxz9 cHaqb" role="text">https://favicon.im<span className="ylgVCe ob9lvb" role="text"> › api</span></cite><div className="eFM0qc BCF2pd">
  //                         <span className="LAWljd"> · </span><a className="dEEN8c" href="https://favicon.im/api" ping="/url?sa=t&amp;source=web&amp;rct=j&amp;opi=89978449&amp;url=https://translate.google.com/translate%3Fu%3Dhttps://favicon.im/api%26hl%3Dpt-BR%26sl%3Den%26tl%3Dpt-BR%26client%3Dsearch&amp;ved=2ahUKEwi6soeqtpaVAxWpiJUCHSm2JioQ7gF6BAgoEAo"><span>Traduzir esta página</span></a>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //               <div className="csDOgf BCF2pd L48a4c">
  //                 <div id="atritem-_xtg2arq3OqmR1sQPqeya0QI_66">
  //                   <div className="MJ8UF iTPLzd rNSxBe eY4mx lUn2nc" aria-describedby="_xtg2arq3OqmR1sQPqeya0QI_57" aria-label="Sobre este resultado" role="button" tabIndex={0}>
  //                     <span className="D6lY4c"><span className="xTFaxe z1asCe"><svg focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></span></span>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div>
  //         gssgysyysysys7 7ge7g 6egy
  //       </div>
  //     </div>
  //   </div>
  // </div>