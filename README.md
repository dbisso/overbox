## Overbox

A basic overlay / lightbox component

### Install via Bower

`bower install dbisso/overbox`

### Add basic CSS

You can customise the styles to suit your needs.

`<link rel="stylesheet" href="bower_components/overbox/overbox.css">`

### Usage

````
// Create the overlay
var overlay = new Overbox();

// use setContent method
overlay.setContent('Some content for your overlay');

// or use jQuery object
overlay.content.append('Some more content');

// then trigger the overlay
overlay.open();
````

### Overbox is an event emitter

````
overlay.on('open', function() {
  console.log( 'opened' );
}).on( 'closed', function() {
  console.log('closed');
});
````
