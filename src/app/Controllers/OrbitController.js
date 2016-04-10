define(
[
  'Environment/Constants',
  'Modules/Clock'
],
function(Constants, Clock) {
  'use strict';

  window.clock = new Clock();
  var prevTime = 0;

  window.clock.start();
  window.clock.stop();

  const COORDINATE_PRECISION = 12;

  class OrbitController {
    constructor(object) {
      this._object = object;
      this._threePlanet = object.threeObject;
      this._distanceFromParent = object.threeDistanceFromParent;
      this._segmentsInDay = 1;
      this._currentDay = 1;
      this._orbitAmplitude = this._object.threeParent ? this._object.threeParent.threeRadius + this._distanceFromParent : 1000;
      this._degreesToRotate = 0.1 * Math.PI / 180;
      this._orbitPositionOffset = object.orbitPositionOffset || 0;
      this._theta = 0;
      this._rotationEnabled = true;

      this.initListeners();
    }

    initListeners() {
      this.positionObject(true);

      document.addEventListener('frame', (e)=> {
        this.positionObject();
        this.rotateObject();
      }, false);
    };

    positionObject(canlog) {
      var time = (clock.getElapsedTime() / 60) + this._orbitPositionOffset;
      var theta = time * (360 / this._object.orbitalPeriod) * Constants.degreesToRadiansRatio;
      var x = this._orbitAmplitude * Math.cos(theta);
      var y = this._orbitAmplitude * Math.sin(theta);

      this._object.theta = theta;

      x = Number.parseFloat(x.toFixed(COORDINATE_PRECISION));
      y = Number.parseFloat(y.toFixed(COORDINATE_PRECISION));

      this._threePlanet.position.set(x, y, 0);
      this._object.core.position.set(x, y, 0);

      var timeParsed = Number.parseInt(time);

      if (timeParsed > 0 && timeParsed % 60 === 0) {
        console.debug(
          '\n',
          'Clock: ', clock.getElapsedTime(),
          '\n',
          'Day Of Year:', time,
          '\n'
        );

        clock = new Clock(true);
      }
    };

    rotateObject() {
      this._threePlanet.rotation.y += this._degreesToRotate; // 1 degree per frame
    };
  }

  return OrbitController;
});