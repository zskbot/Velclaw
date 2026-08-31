<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <language>en</language>
    <title>W3C - SVG Working Group</title>
    <description>The mission of the Scalable Vector Graphics (SVG) Working Group is to develop and maintain SVG.</description>
    <pubDate>Thu, 27 Aug 2026 10:13:24 +0000</pubDate>
    <generator>Laminas_Feed_Writer 2 (https://getlaminas.org)</generator>
    <link>https://www.w3.org/groups/wg/svg/</link>
    <atom:link rel="self" type="application/rss+xml" href="https://www.w3.org/groups/wg/svg/feed/"/>
    <item>
      <title>Followup on Internet Explorer Interview</title>
      <pubDate>Mon, 07 Jun 2010 16:28:12 +0000</pubDate>
      <link>https://www.w3.org/blog/2010/ie9-suport/</link>
      <guid>https://www.w3.org/blog/2010/ie9-suport/</guid>
      <author>J. Alan Bird</author>
      <comments>https://www.w3.org/blog/2010/ie9-suport/#comments</comments>
      <category><![CDATA[blogs]]></category>
      <dc:creator>J. Alan Bird</dc:creator>
      <content:encoded><![CDATA[<div class="component component--text">

<p>On the heels of my <a href="http://www.w3.org/blog/SVG/2010/06/04/interview_ie">interview with IE9's Patrick Dengler</a>, I got some private feedback that was critical of Microsoft for not supporting all of SVG 1.1 in their first SVG implementation.</p>
<p>To put it into perspective, there is no browser that supported all of SVG 1.1 in its first SVG release.  In fact, there is no browser today that supports all of SVG 1.1.  Opera, Firefox, and WebKit all have missing pieces... and their early releases of SVG support were missing the same bits of SVG as IE9 will: filters, declarative animation, and SVG Fonts.  Mozilla has even stated that they do not intend to support SVG Fonts at all (pending more concrete community feedback).</p>
<p>But they all support a very large, functional subset of SVG 1.1, and I'm very excited that IE9 will add as much SVG as they have announced.  This means that developers and designers can use the vast majority of SVG 1.1 in their content.</p>
<p>Does this mean that what IE9 supports is all I ever expect from IE.  Of course not.  At the very least, I want to see filters and some sort of declarative animation in IE10.  And I've heard from Patrick that they are listening very closely to the developer community, so if you want those features too, then be vocal about it.</p>
<p>But it's silly to hold Microsoft to a higher standard than the other browser vendors, for their first release.  Everyone, even Microsoft, has limited resources, so I'd have been stunned if they did all of SVG 1.1 in IE9.  And I'll be surprised if they are missing features like filters and animation in IE10.</p>
<p>Another way to look at this is that once IE ships support for something, it is next to impossible for them to change it (maybe even more than other browser vendors).  Since the SVG WG intends to coordinate with the CSS WG to make some changes to animation and to extend filters, it's probably best that IE9 doesn't lock those into their current states.  Microsoft is participating in that process, so I'm confident that whatever emerges will end up in a future release of Internet Explorer.</p>

</div>]]></content:encoded>
      <slash:comments>0</slash:comments>
    </item>
    <item>
      <title>Interview with Internet Explorer's Patrick Dengler</title>
      <pubDate>Fri, 04 Jun 2010 16:57:00 +0000</pubDate>
      <link>https://www.w3.org/blog/2010/interview-ie/</link>
      <guid>https://www.w3.org/blog/2010/interview-ie/</guid>
      <author>J. Alan Bird</author>
      <comments>https://www.w3.org/blog/2010/interview-ie/#comments</comments>
      <category><![CDATA[blogs]]></category>
      <dc:creator>J. Alan Bird</dc:creator>
      <content:encoded><![CDATA[<div class="component component--text">
<p>To provide a little insight into the current state of SVG implementations, I put out an open call to implementers for email interviews. For the first in this series of interviews, I chatted with one of the newest implementers of SVG, Patrick Dengler of Microsoft&#39;s Internet Explorer team. He is the Senior Program Manager of the group responsible for putting SVG into IE9.</p>

<p>We exchanged questions and answers over email, just before last week&#39;s SVG Working Group face-to-face meeting. I asked Patrick some questions, and he asked me some.</p>

<p><strong>Update:</strong><em> A couple people were confused by the interleaved format, with Patrick and I taking turns asking questions. To try to make it clearer, I have removed the attribute labels where the speaker does not change, and emphasized the questions. I hope that helps!</em></p>
</div>]]></content:encoded>
      <slash:comments>0</slash:comments>
    </item>
    <item>
      <title>Welcome to the SVG WG Blog!</title>
      <pubDate>Thu, 14 Jan 2010 16:25:19 +0000</pubDate>
      <link>https://www.w3.org/blog/2010/welcome-to-the-svg-wg-blog/</link>
      <guid>https://www.w3.org/blog/2010/welcome-to-the-svg-wg-blog/</guid>
      <author>J. Alan Bird</author>
      <comments>https://www.w3.org/blog/2010/welcome-to-the-svg-wg-blog/#comments</comments>
      <category><![CDATA[blogs]]></category>
      <dc:creator>J. Alan Bird</dc:creator>
      <content:encoded><![CDATA[<div class="component component--text">

<p>SVG is growing in popularity by leaps and bounds.  The SVG Working Group wants to make sure that SVG expands to meet the needs of the designer and developer community.</p>
<p>To that end, we have put a lot of effort into opening up our process: we've changed from a member-only group to a public group; we hold all our technical discussions in <a href="http://lists.w3.org/Archives/Public/public-svg-wg/">public</a>; we post all our meeting agendas and minutes to the read-write <a href="http://lists.w3.org/Archives/Public/www-svg/">www-svg</a> list, and take agenda requests from the public; we started an open <a href="http://www.w3.org/Graphics/SVG/IG/">SVG Interest Group</a>, which everyone is welcome to join; we've reached out to the open-source community to invite participation by an Inkscape contributor (more on that later); and we're actively seeking out the opinions of community leaders and people from the trenches in a variety of ways.</p>
<p>But sometimes too much is not enough.  It's hard for busy people to sift through the technical details and standards process to find the SVG gold dust that helps them in their everyday jobs.  Thus, this blog.  We will try to keep you updated on the most relevant details of SVG implementations, publication of specifications, links to cool uses of SVG, and other news in the SVG world.</p>
<p>Readers who want to play an active role in the development of the SVG language are invited to post to the <a href="http://lists.w3.org/Archives/Public/www-svg/">www-svg mailing list</a>, as usual, but we hope this blog (and its <a href="http://www.w3.org/Graphics/SVG/blog?tempskin=_atom">Atom newsfeed</a>) will help you stay aware of what you need to know about SVG's progress.</p>

</div>]]></content:encoded>
      <slash:comments>0</slash:comments>
    </item>
  </channel>
</rss>