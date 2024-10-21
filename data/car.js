class Car {
  #brand;
  #model;
  speed;
  isTrunkOpen = false;

  constructor(carDetails) {
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
    this.speed = 0;
  }

  displayInfo() {
    console.log(`${this.#brand} ${this.#model}, speed: ${this.speed} km/h`);
  }

  go() {
    if (this.isTrunkOpen) return;
    this.speed += 5;
    this.speedLimit();
  }

  break() {
    this.speed -= 5;
    this.speedLimit();
  }

  speedLimit() {
    if (this.speed < 0) this.speed = 0;
    else if (this.speed > 200) this.speed = 200;
  }

  openTrunk() {
    if (this.speed !== 0) return;
    else {
      this.isTrunkOpen = true;
    }
  }

  closeTrunk() {
    if (this.isTrunkOpen) this.isTrunkOpen = false;
    else return;
  }
}

class RaceCar extends Car {
  acceleration;

  constructor(carDetails) {
    super(carDetails);
    this.acceleration = carDetails.acceleration;
  }

  go() {
    this.speed += this.acceleration;
    this.speedLimit();
  }

  speedLimit() {
    if (this.speed < 0) this.speed = 0;
    else if (this.speed > 300) this.speed = 300;
  }

  openTrunk() {
    return;
  }

  closeTrunk() {
    return;
  }
}


const cars = [{
  brand: 'Toyota',
  model: 'Corolla'
}, {
  brand: 'Tesla',
  model: 'Model 3'
}, {
  brand: 'McLaren',
  model: 'F1',
  acceleration: 20,
  type: 'race'
}].map((carDetails) => {
  if (carDetails.type === 'race') return new RaceCar(carDetails);
  return new Car(carDetails);
});

cars.forEach((car) => {
  car.openTrunk();
  car.go();
  car.go();
  car.closeTrunk();
  car.go();
  car.go();
  car.go();
  car.go();
  car.go();
  car.go();
  car.go();
  car.go();
  car.break();
  car.displayInfo();
})