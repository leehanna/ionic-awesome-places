import { Place } from "../app/models/place";
import { Location } from "../app/models/location";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable()
export class PlacesService {
  private places: Place[] = [];

  constructor(private storage: Storage) {}

  addPlace(title: string, description: string, location: Location, imageUrl: string) {
    this.places.push(new Place(title, description, location, imageUrl));
    this.updateStorage();
  }

  getPlaces() {
    return this.places.slice();
  }

  fetchPlaces() {
    return this.storage.get('places')
      .then(
        data => {
          this.places = data;
          return this.places.slice();
        }
      )
      .catch(
        error => {
          console.log(error);
          this.places = [];
          return [];
        }
      );
  }

  updateStorage() {
    this.storage.set('places', this.places)
    .then(
      data => console.log('Places updated successfully!')
    )
    .catch( (error) => {
      console.log(error);
    });
  }

  deletePlace(index: number) {
    this.places.splice(index, 1);
    this.updateStorage();
  }
}
