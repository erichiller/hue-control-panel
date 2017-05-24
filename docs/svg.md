# SVG

[Mozilla Reference - SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)
   - [Mozilla - SVG & CSS](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS)

[w3 Schools - SVG](https://www.w3schools.com/html/html5_svg.asp)

## Styling , CSS

`<text>` elements are colored with `fill` just the same as the internals of `<rect>`; **they do NOT use** `color:` as _HTML_ does. Like this:  
```svg
var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text.setAttribute('x', '10');
text.setAttribute('y', '20');
text.setAttribute('fill', '#000');
text.textContent = '2';
```

### Fonts

<http://nimbupani.com/about-fonts-in-svg.html>

### Stylesheets

**SVG 1.1** changes the way that _stylesheets_ are referenced, see: <https://www.w3.org/TR/SVG11/styling.html#StyleAttribute>

**Example**  
```svg
mystyle.css
rect {
  fill: red;
  stroke: blue;
  stroke-width: 3
}

SVG file referencing mystyle.css
<?xml version="1.0" standalone="no"?>
<?xml-stylesheet href="mystyle.css" type="text/css"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1"
     width="10cm" height="5cm" viewBox="0 0 1000 500">
  <rect x="200" y="100" width="600" height="300"/>
</svg>
```

**But embedded CSS is still the same**  
```svg
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1"
     width="10cm" height="5cm" viewBox="0 0 1000 500">
  <defs>
    <style type="text/css"><![CDATA[
      rect {
        fill: red;
        stroke: blue;
        stroke-width: 3
      }
    ]]></style>
  </defs>
  <rect x="200" y="100" width="600" height="300"/>
</svg>
```
