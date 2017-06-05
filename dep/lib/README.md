called through `colorPalette.attachEvent()`


onControlPointerStart

__ELEMENT__		__EVENT__	__CALL__
document		mousedown	eventToColorPalette
window			resize		eventToColorPalette

#### attachGroupEvent	__GROUP__	__EVENT__	__CALL__
(called from onControlPointerStart; which is called from onDocumentMousedown)
document		drag		mousemove	onDocumentPointerMove
document		drag		mouseup		onDocumentPointerEnd
####

__ELEMENT__		__EVENT__	__CALL__
"parent Elements"	scroll		this.onParentScroll

GOES TO:
valueElement		keyup		( internal to drawpicker() ) -> updateField()
valueElement		input		( internal to drawpicker() ) -> updateField()
valueElement		blur		this.blurValue
this.picker.wrap	touchstart	this.onControlTouchStart

