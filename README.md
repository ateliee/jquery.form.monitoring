# jquery plugin
this plugin form change monitoring.
form childs element change or keydown callback function.

```
(function(){
    $('form#form').formMonitoring({
        ajax: true,     // boolean or $.ajax() option paramater
        ajaxLoading: function(elm){
            // if ajax option then call ajax before call
        },
        callback : function(elm){
            // callback change...
        }
    });
($));
```

```
<form action="" id="form">
    <input type="text" name="name" value="">
    <select name="type">
        <option value="1">apple</option>
        <option value="2">orange</option>
    </select>
</form>
```