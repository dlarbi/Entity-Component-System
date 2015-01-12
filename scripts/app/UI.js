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
    }
  }
})
