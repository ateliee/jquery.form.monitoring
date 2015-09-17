
(function($) {
    $.fn.formMonitoring = function(options){
        var $self = $(this);
        var settings = {
            ajax : null,
            ajaxLoading : null,
            callback: null
        };
        if((typeof options) == 'function'){
            settings['callback'] = options;
        }else{
            settings = $.extend(settings,options);
        }
        $self.settings = settings;
        $self.change = function(){
            if($self.settings['ajax']){
                var ajax = $self.settings['ajax'];
                if(typeof ajax != 'object'){
                    ajax = {
                        url : $self.attr('action')
                    };
                }
                if(!$self.data('formChange.loading')){
                    var param = $.extend({}, ajax,{
                        data:$self.serialize(),
                        success: function(res){
                            if($self.settings['ajax']['success']){
                                $self.settings['ajax']['success'](res);
                            }
                            if($self.settings['callback']){
                                $self.settings['callback']($self,res);
                            }
                            $self.removeData('formChange.loading');
                            if($self.data('formChange.wait')){
                                $self.removeData('formChange.wait');
                                $self.change();
                            }
                        },
                        error: function(e,e2,e3){
                            if($self.settings['ajax']['error']){
                                $self.settings['ajax']['error'](e,e2,e3);
                            }
                            if($self.settings['callback']){
                                $self.settings['callback']($self);
                            }
                            $self.removeData('formChange.loading');
                            if($self.data('formChange.wait')){
                                $self.removeData('formChange.wait');
                                $self.change();
                            }
                        }
                    });
                    $self.data('formChange.loading',true);
                    $self.removeData('formChange.wait');
                    if($self.settings['ajaxLoading']){
                        $self.settings['ajaxLoading']();
                    }
                    $.ajax(param);
                }else{
                    $self.data('formChange.wait',true);
                }
            }else{
                if($self.settings['callback']) {
                    return $self.settings['callback'].apply(this, [$self]);
                }
            }
            return true;
        };
        var $lists = $(this).find('input,textarea,select');
        if($(this).is('input,textarea,select')){
            $lists = $(this);
        }
        $lists.filter('input,textarea').not('[type=checkbox],[type=radio],[type=date],[type=datetime]').on('monitoring.check',function(){
            var data = $(this).data('before.val');
            var val = $(this).val();
            if(data != val){
                if($self.change() !== false){
                    $(this).data('before.val',val);
                }
            }
        }).on('keyup',function(){ $(this).trigger('monitoring.check'); }).each(function(){
            $(this).data('before.val',$(this).val());
        });
        $lists.filter('select,input[type=checkbox],input[type=radio],input[type=date],input[type=datetime]').on('change',function(){
            if($self.change() !== false){
                $(this).data('before.val',$(this).val());
            }
        });

        $self.interval = function(){
            var time = setTimeout(function(){
                $lists.trigger('monitoring.check');
                $self.interval();
            },300);
        };
        $self.interval();
    };
})(jQuery);