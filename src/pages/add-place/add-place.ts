import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Location } from '../../app/models/location';
import { SetLocationPage } from '../set-location/set-location';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PlacesService } from '../../services/places';


@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = {
    latitude: 40.7624324,
    longitude: -73.9759827
  };
  locationChosen = false;
  photoURI = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private geolocation: Geolocation,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private camera: Camera,
              private placesService: PlacesService) {
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Locating you...'
    });
    loader.present();
    this.geolocation.getCurrentPosition()
      .then(
        location => {
          this.location.latitude = location.coords.latitude;
          this.location.longitude = location.coords.longitude;
          this.locationChosen = true;
          loader.dismiss();
        }
      )
      .catch(
        error => {
          loader.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Error',
            message: error,
            buttons: ['Ok']
          });
          alert.present();
        }
      );
  }

  onSelectOnMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, locationChosen: this.locationChosen});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.location = data.location;
        this.locationChosen = true;
      }
    });
  }

  onTakePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture({}).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(base64Image);
      this.photoURI = imageData;
     }, (err) => {
        console.log(err);
        const alert = this.alertCtrl.create({
          title: 'Error getting image',
          message: err,
          buttons: ['Ok']
        })
     });
  }

  onSubmit(form: NgForm) {
    this.placesService.addPlace(
      form.value.title,
      form.value.description,
      this.location,
      this.photoURI
    );
    this.location = {
      latitude: 40.7624324,
      longitude: -73.9759827
    };
    this.photoURI = "";
    form.reset();
    this.navCtrl.pop();
  }

}
