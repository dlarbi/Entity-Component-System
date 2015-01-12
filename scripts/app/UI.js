define(function() {

  var PlayerHealth;
  var HealthDOMElement = $('#PlayerHealth');

  var setUIHealth = function(value) {
    HealthDOMElement.html(value);
  }


  return {
    updatePlayerHealth : function(value) {
      PlayerHealth = value;
      setUIHealth(PlayerHealth)
      return PlayerHealth;
    },
    updateEntityHealth : function(entity) {
      var percentWidth = 100*entity.components.Health.value/20
      $('[data-entity="'+entity.id+'"] #health').css('width', percentWidth + '%');
      return;
    }
  }
})
