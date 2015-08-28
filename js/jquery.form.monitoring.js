
(function($) {
    $.fn.formMonitoring = function(options){
        var $self = $(this);
        var settings = {
            ajax : null,
            ajaxLoading : null,
            callback: null
        };
        settings = $.extend(settings,options);
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
                    $self.settings['callback']($self);
                }
            }
        };
        $(this).find('input,textarea').not('[type=checkbox],[type=radio],[type=date],[type=datetime]').on('keyup',function(){
            var data = $(this).data('before.val');
            if(!data || (data != $(this).val())){
                $(this).data('before.val',$(this).val());
                $self.change();
            }
        });
        $(this).find('select,input[type=checkbox],input[type=radio],input[type=date],input[type=datetime]').on('change',function(){
            $self.change();
        });
    };
})(jQuery);