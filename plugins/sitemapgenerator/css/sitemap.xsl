<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>Sitemap Generator</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<style type="text/css">
					
					body{
						font-family:"Segoe UI", "HelveticaNeue", "Lucida Grande","Lucida Sans Unicode",Tahoma,Verdana;
						font-size:	13px;
						line-height:20px;
						padding:	0px;
					}
					
					#content{
						position:	fixed;	
						height:		100%;
						top:		0px;
						left:		0px;
						width:		100%;
						
						background-size:cover;
						background-repeat:no-repeat;
						background-image: -ms-radial-gradient(left top, circle cover,  #FFFFFF 20%, #FFFFFF 20%, #E8E8E8 50%, #CDCDCD 50%, #CDCDCD 60%, #E8E8E8 60%, #E8E8E8 70%, #CFCFCF 70%, #CFCFCF 90%, #F5F5F5 90%);
						background-image: -moz-radial-gradient(left top, circle cover, #FFFFFF 20%, #FFFFFF 20%, #E8E8E8 50%, #CDCDCD 50%, #CDCDCD 60%, #E8E8E8 60%, #E8E8E8 70%, #CFCFCF 70%, #CFCFCF 90%, #F5F5F5 90%);
						background-image: -o-radial-gradient(left top, circle cover, #FFFFFF 20%, #FFFFFF 20%, #E8E8E8 50%, #CDCDCD 50%, #CDCDCD 60%, #E8E8E8 60%, #E8E8E8 70%, #CFCFCF 70%, #CFCFCF 90%, #F5F5F5 90%);
						background-image: -webkit-gradient(radial, left top, 0, left top, 1020, color-stop(0.2, #FFFFFF), color-stop(0.2, #FFFFFF), color-stop(0.5, #E8E8E8), color-stop(0.5, #CDCDCD), color-stop(0.6, #CDCDCD), color-stop(0.6, #E8E8E8), color-stop(0.7, #E8E8E8), color-stop(0.70, #CFCFCF), color-stop(0.9, #CFCFCF), color-stop(0.9, #F5F5F5));
						background-image: -webkit-radial-gradient(left top, circle cover, #FFFFFF 20%, #FFFFFF 20%, #E8E8E8 50%, #CDCDCD 50%, #CDCDCD 60%, #E8E8E8 60%, #E8E8E8 70%, #CFCFCF 70%, #CFCFCF 90%, #F5F5F5 90%);
						background-image: radial-gradient(left top, circle cover, #FFFFFF 20%, #FFFFFF 20%, #E8E8E8 50%, #CDCDCD 50%, #CDCDCD 60%, #E8E8E8 60%, #E8E8E8 70%, #CFCFCF 70%, #CFCFCF 90%, #F5F5F5 90%);
						padding:10px;
						margin:	0px;
						
					}
					
					#content > h1{
						position:	fixed;
						top:		5px;
						width:		800px;
						margin-left:-400px;
						left:		50%;
						font-size:	50px;
						font-weight:lighter;
						color:		#069;
					}
					
					#the-content{
						position:	fixed;
						top:		100px;
						width:		800px;
						bottom:		50px;
						height:		auto;
						overflow:	auto;
						margin-left:-400px;
						left:		50%;
						border:		#CFCFCF 1px solid;
						
						background-size:cover;
	
						background-image: -ms-radial-gradient(left top, circle cover, #FFFFFF 0%, #E8E8E8 50%);
						background-image: -moz-radial-gradient(left top, circle cover, #FFFFFF 0%, #E8E8E8 50%);
						background-image: -o-radial-gradient(left top, circle cover, #FFFFFF 0%, #E8E8E8 50%);
						background-image: -webkit-gradient(radial, left top, 0, left top, 1020, color-stop(0, #FFFFFF), color-stop(0.5, #E8E8E8));
						background-image: -webkit-radial-gradient(left top, circle cover, #FFFFFF 0%, #E8E8E8 50%);
						background-image: radial-gradient(left top, circle cover, #FFFFFF 0%, #E8E8E8 50%);
						
						padding:	10px;
					}
					
					#the-content > table{
						width:100%;
					}
					
					#intro {
						opacity:0.5;
						background-color:#282828;
						color:	white;
						width:	400px;
						padding:5px 13px 5px 13px;
						margin:10px;
					}
					#intro:hover{
						opacity:1;	
					}
					#intro a{
						color:#09C;
					}
					
					#intro p {
						line-height:	16.8667px;
					}
					
					td {
						font-size:11px;
					}
					
					th {
						text-align:center;
						background:#DFDFDF;
						font-size:11px;
					}
					
					tr.high {
						background-color:whitesmoke;
					}
					
					#footer {
						position:	fixed;
						bottom:		5px;
						width:		800px;
						margin:		10px;
						text-align:center;
						margin-left:-400px;
						left:		50%;
						
						padding:2px;
						font-size:8pt;
						color:gray;
					}
					
					#footer a {
						color:gray;
					}
					
					a {
						color:black;
					}
				</style>
			</head>
			<body>
				
                
                <div id="content">
                	<h1>Sitemap Generator</h1>
                	<div id="intro">
                        <p>
                            This is a XML Sitemap which is supposed to be processed by search engines like <a href="http://www.google.com">Google</a>, <a href="http://search.msn.com">MSN Search</a> and <a href="http://www.yahoo.com">YAHOO</a>.<br />
                            It was generated using the library <a href="http://javalyss.fr/">Sitemap Generator</a> developped by <a href="http://javalyss.fr">Javalyss</a>.
                            You can find more information about XML sitemaps on <a href="http://sitemaps.org">sitemaps.org</a> and Google's <a href="http://code.google.com/sm_thirdparty.html">list of sitemap programs</a>.
                        </p>
                    </div>
                    <div id="the-content">
                    	
                        <table cellpadding="5">
                            <tr style="border-bottom:1px black solid;">
                                <th>URL</th>
                                <th>Priority</th>
                                <th>Change Frequency</th>
                                <th>LastChange (GMT)</th>
                            </tr>
                            <xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
                            <xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
                            <xsl:for-each select="sitemap:urlset/sitemap:url">
                                <tr>
                                    <xsl:if test="position() mod 2 != 1">
                                        <xsl:attribute  name="class">high</xsl:attribute>
                                    </xsl:if>
                                    <td>
                                        <xsl:variable name="itemURL">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </xsl:variable>
                                        <a href="{$itemURL}">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </a>
                                    </td>
                                    <td>
                                        <xsl:value-of select="concat(sitemap:priority*100,'%')"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="concat(translate(substring(sitemap:changefreq, 1, 1),concat($lower, $upper),concat($upper, $lower)),substring(sitemap:changefreq, 2))"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)))"/>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </table>
                   
             		</div>
                    <div id="footer">
						Generated with <a href="http://javalyss.fr" title="Sitemap generator">Sitemap Generator library for Javalyss</a> by <a href="http://www.rom-makita.fr/">Romakita</a>. This XSLT template is released under GPL.
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>