(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{6013:function(e,t,a){"use strict";a.r(t);var l=a(45),n=a.n(l),r=a(62),s=a(13),c=a(10),o=a(443),i=a(14),m=a(444),u=a(11),d=a(0),p=a.n(d),h=a(739),b=a(228),f=a(759),g=a(760),E=a(15),N=a(488),x=a(473),v=a(698),C=a(699),S=a(700),k=a(786),O=a.n(k),j=a(469),y=[{value:1,label:"6th"},{value:2,label:"7th"},{value:3,label:"8th"},{value:4,label:"9th"},{value:5,label:"10th"},{value:6,label:"11th"},{value:7,label:"12th"}],w=[{value:1,label:"A"},{value:2,label:"B"},{value:3,label:"C"},{value:4,label:"D"},{value:5,label:"E"}],A=function(e){function t(){var e,a;Object(s.a)(this,t);for(var l=arguments.length,n=new Array(l),r=0;r<l;r++)n[r]=arguments[r];return(a=Object(o.a)(this,(e=Object(i.a)(t)).call.apply(e,[this].concat(n)))).state={schoolName:"",schoolNumber:"",schoolAddress:"",studentName:"",adharNumber:"",motherName:"",fatherName:"",className:"",cellNumber:"",dob:""},a.setStudentClass=function(e){var t="";return y.map(function(a){e===a.value&&(t=a.label)}),t},a.setStudentSection=function(e){var t="";return w.map(function(a){e===a.value&&(t=a.label)}),t},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=Object(r.a)(n.a.mark(function e(){var t,a,l;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("did mount",this.props.match.params.studentid),t=this.props.match.params.studentid,e.next=4,this.props.authenticatedApiCall("get","/api/studentfeeservice/"+t+"/getfeeprintdetails",null);case 4:a=e.sent,console.log(a),1===a.data.status&&(l=a.data.statusDescription,this.setState({schoolName:l.schoolName,schoolNumber:l.schoolNumber,schoolAddress:l.schoolAddress,studentName:l.studentName,adharNumber:l.adharNumber,motherName:l.motherName,fatherName:l.fatherName,className:this.setStudentClass(l.class)+" "+this.setStudentSection(l.section),cellNumber:l.cellNumber,dob:l.dob}));case 7:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"todayDate",value:function(){var e=new Date;return p.a.createElement(O.a,{format:"MMMM D, YYYY",withTitle:!0},p.a.createElement("b",null,e))}},{key:"render",value:function(){console.log(this.props);var e=this.state,t=this.props.classes;return p.a.createElement("div",{className:t.root},p.a.createElement(j.Helmet,null,p.a.createElement("title",null,"Student Fee Details")),p.a.createElement(N.a,{container:!0,id:"section-to-print",className:"graphTable"},p.a.createElement(N.a,{item:!0,lg:4,md:4},p.a.createElement(b.a,{variant:"h6"},"Registration No. ",e.schoolNumber)),p.a.createElement(N.a,{item:!0,lg:5,md:5,style:{marginLeft:"20px"}},p.a.createElement(b.a,{variant:"h4"},e.schoolName)),p.a.createElement(N.a,{item:!0,lg:12,md:12,sm:12,xs:12},p.a.createElement(f.a,null,p.a.createElement(g.a,null,p.a.createElement(x.a,null,p.a.createElement(v.a,null,p.a.createElement(S.a,null,p.a.createElement(C.a,{colSpan:"2",className:t.tableHeading}," ",p.a.createElement("h3",null,"Student Details")," ")),p.a.createElement(S.a,null,p.a.createElement(C.a,{className:t.tableCell}," Student Name  "),p.a.createElement(C.a,{className:t.tableCell}," ",e.studentName," ")),p.a.createElement(S.a,null,p.a.createElement(C.a,{className:t.tableCell}," Mother Name  "),p.a.createElement(C.a,{className:t.tableCell}," ",e.motherName," ")),p.a.createElement(S.a,null,p.a.createElement(C.a,{className:t.tableCell}," Father Name  "),p.a.createElement(C.a,{className:t.tableCell}," ",e.fatherName," ")),p.a.createElement(S.a,null,p.a.createElement(C.a,{className:t.tableCell}," AAdhar Number  "),p.a.createElement(C.a,{className:t.tableCell}," ",e.adharNumber," ")),p.a.createElement(S.a,null,p.a.createElement(C.a,{className:t.tableCell}," Cell Number  "),p.a.createElement(C.a,{className:t.tableCell}," ",e.cellNumber," ")),p.a.createElement(S.a,null,p.a.createElement(C.a,{className:t.tableCell}," Date of Birth"),p.a.createElement(C.a,{className:t.tableCell}," ",e.dob," ")),p.a.createElement(S.a,null,p.a.createElement(C.a,{className:t.tableCell}," Class "),p.a.createElement(C.a,{className:t.tableCell}," ",e.className," "))))))),p.a.createElement(N.a,{item:!0,lg:12,md:12,sm:12,xs:12,style:{marginTop:"20px"}},p.a.createElement(f.a,null,p.a.createElement(g.a,null,p.a.createElement(x.a,null,p.a.createElement(v.a,null,p.a.createElement(S.a,null,p.a.createElement(C.a,{colSpan:"2",className:t.tableHeading}," ",p.a.createElement("h3",null,"Student Fee Details")," ")),p.a.createElement(S.a,null,p.a.createElement(C.a,{className:t.tableCell}," January"),p.a.createElement(C.a,{className:t.tableCell}," 1000 ")))))))))}}]),t}(p.a.Component);t.default=Object(E.a)(function(e){return{root:Object(u.a)({marginTop:12*e.spacing.unit,maxWidth:"900px",margin:"0 auto"},e.breakpoints.down("md"),{margin:0,paddingLeft:0,paddingRight:0,paddingTop:0}),tableHeading:{border:"1px solid #000",height:"30px",textAlign:"center"},tableCell:{border:"1px solid #000",height:"30px",textAlign:"left"},table:{maxWidth:860},tableBorder:{paddingLeft:0,maxWidth:150,minWidth:400},tableBorder1:{},tableBorder2:{maxWidth:150,paddingLeft:4},alternateRow:{"&:nth-of-type(odd)":{backgroundColor:"#fff"}},header:{padding:"0 0 0 55px",background:"rgb(224, 225, 226)",maxWidth:"750px",margin:"0 auto"},prescriptionbody:{padding:"15px 0 0 35px",maxWidth:"700px",margin:"0 auto"},underline:{textDecoration:"underline",fontSize:"20px",marginRight:"5px"},texts:{fontSize:"20px"},qrCode:{position:"absolute",left:0,top:-35},text2:{fontSize:"12px !important",paddingRight:35},text3:{fontSize:"16px !important"},text4:{fontSize:"10px !important",marginLeft:20},text5:{fontSize:"12px !important"},text6:{fontSize:"9px !important"}}})(Object(h.a)(["Teacher","FeeAccount"])(A))},739:function(e,t,a){"use strict";var l=a(45),n=a.n(l),r=a(62),s=a(13),c=a(10),o=a(443),i=a(14),m=a(444),u=a(0),d=a.n(u),p=a(134),h=(a(743),a(6023)),b=a(48),f=a.n(b),g=a(755),E=a(135),N=a.n(E);t.a=function(){return function(e){return Object(p.a)(Object(g.a)(function(e){return function(t){function a(){var e,t;Object(s.a)(this,a);for(var l=arguments.length,c=new Array(l),m=0;m<l;m++)c[m]=arguments[m];return(t=Object(o.a)(this,(e=Object(i.a)(a)).call.apply(e,[this].concat(c)))).state={isError:!1},t.makeAuthenticatedAPICall=function(){var e=Object(r.a)(n.a.mark(function e(a,l,r){var s,c;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.prev=1,e.next=4,f()({method:a,url:l,headers:{"x-access-token":localStorage.getItem("accessToken")},data:r});case 4:if(200!==(s=e.sent).status){e.next=9;break}return e.abrupt("return",s);case 9:t.setState({isError:!0});case 10:e.next=26;break;case 12:if(e.prev=12,e.t0=e.catch(1),!(e.t0.response.status=401)){e.next=25;break}return e.next=17,t.props.currentUser.refreshTokens();case 17:return e.next=19,f()({method:a,url:l,headers:{"x-access-token":localStorage.getItem("accessToken")},data:r});case 19:if(200!==(c=e.sent).status){e.next=24;break}return e.abrupt("return",c);case 24:t.setState({isError:!0});case 25:throw e.t0;case 26:e.next=32;break;case 28:e.prev=28,e.t1=e.catch(0),console.log("ERROR:",e.t1),t.setState({isError:!0});case 32:case"end":return e.stop()}},e,null,[[0,28],[1,12]])}));return function(t,a,l){return e.apply(this,arguments)}}(),t.getRedirectQueryString=function(e){var t={redirectTo:e};return"?".concat(N.a.stringify(t))},t}return Object(m.a)(a,t),Object(c.a)(a,[{key:"render",value:function(){var t=this.props.currentUser;return this.state.isError?d.a.createElement(h.a,{to:"/guest/login".concat(this.getRedirectQueryString(this.props.location.pathname))}):d.a.createElement(e,Object.assign({loggedInUserObj:t,authenticatedApiCall:this.makeAuthenticatedAPICall},this.props))}}]),a}(d.a.Component)}(e)))}}}}]);
//# sourceMappingURL=16.7b0ac02d.chunk.js.map