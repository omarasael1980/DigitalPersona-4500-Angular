import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import {
  FingerprintReader,
  SampleFormat,
  DeviceConnected,
  DeviceDisconnected,
  SamplesAcquired,
  AcquisitionStarted,
  AcquisitionStopped
} from "@digitalpersona/devices";
import './core/modules/WebSdk';
import { RouterOutlet } from '@angular/router';

/**
 * Represents the root component of the application.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo-fingerprint-reader';
  ListaFingerPrint: any;
  InfoFingerprintReader: any;
  ListaSamplesFingerPrints: any;
  currentImageFinger: any;
  private reader: FingerprintReader;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.reader = new FingerprintReader();
  }

  /**
   * Event handler for when a device is connected.
   * @param ev The DeviceConnected event object.
   */
  private onDeviceConnected = (ev: DeviceConnected) => {
    console.log("Connected ");
  };

  /**
   * Event handler for when a device is disconnected.
   * @param ev The DeviceDisconnected event object.
   */
  private onDeviceDisconnected = (ev: DeviceDisconnected) => {
    console.log("Disconnected ");
  };

  /**
   * Event handler for when samples are acquired.
   * @param ev The SamplesAcquired event object.
   */
  private onSamplesAcquired = (ev: SamplesAcquired) => {
    console.log("In the event: SamplesAcquired");
    console.log(ev);
    this.ListaSamplesFingerPrints = ev;
    console.log("Adding images");
    this.changeDetectorRef.detectChanges(); // Update the user interface
  };

  /**
   * Event handler for when acquisition is started.
   * @param ev The AcquisitionStarted event object.
   */
  private onAcquisitionStarted = (ev: AcquisitionStarted) => {
    console.log("In the event: AcquisitionStarted ");
    console.log(ev);
  };

  /**
   * Event handler for when acquisition is stopped.
   * @param ev The AcquisitionStopped event object.
   */
  private onAcquisitionStopped = (ev: AcquisitionStopped) => {
    console.log("In the event: AcquisitionStopped ");
    console.log(ev);
  };

  ngOnInit() {
    // Associate events with methods
    this.reader.on("DeviceConnected", this.onDeviceConnected);
    this.reader.on("DeviceDisconnected", this.onDeviceDisconnected);
    this.reader.on("SamplesAcquired", this.onSamplesAcquired);
    this.reader.on("AcquisitionStarted", this.onAcquisitionStarted);
    this.reader.on("AcquisitionStopped", this.onAcquisitionStopped);
  }

  ngOnDestroy() {
    this.reader.off("DeviceConnected", this.onDeviceConnected);
    this.reader.off("DeviceDisconnected", this.onDeviceDisconnected);
    this.reader.off("SamplesAcquired", this.onSamplesAcquired);
    this.reader.off("AcquisitionStarted", this.onAcquisitionStarted);
    this.reader.off("AcquisitionStopped", this.onAcquisitionStopped);
  }

  /**
   * Retrieves the list of devices.
   */
  fn_ListarDispositivos() {
    Promise.all([
      this.reader.enumerateDevices()
    ]).then((devices) => {
      this.ListaFingerPrint = devices;
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Retrieves information about the fingerprint reader device.
   */
  fn_DeviceInfo() {
    Promise.all([
      this.reader.enumerateDevices()
    ]).then((devices) => {
      var dispositivos = this.ListaFingerPrint = devices;
      this.InfoFingerprintReader = JSON.stringify(this.ListaFingerPrint[0]);
      this.InfoFingerprintReader = this.InfoFingerprintReader.replace(/[\[\]"]/g, '');

      console.log("see ", this.InfoFingerprintReader);
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Starts the fingerprint capture process.
   */
  fn_startCapture() {
    Promise.all([
      this.reader.startAcquisition(SampleFormat.PngImage, this.InfoFingerprintReader)
    ]).then((response) => {
      console.log("Starting capture");
      console.log(response);

      // Add additional verification if necessary
      this.changeDetectorRef.detectChanges(); // Update the user interface
      console.log("reading")
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Stops the fingerprint capture process.
   */
  fn_stopCapture() {
    this.reader.stopAcquisition(this.ListaFingerPrint[0])
      .then((response) => {
        console.log("Stopping capture");
        console.log(response);
      }).catch((error) => {
        console.log(error);
      });
  }

  /**
   * Captures the fingerprint image.
   */
  fn_CaptureImage() {
    // Print the base64 fingerprint
    console.log("Do you see this?", this.ListaSamplesFingerPrints.samples[0]);

    // Verify the type
    var base64 = this.ListaSamplesFingerPrints.samples[0];

    // Verify that it is not empty
    if (base64) {
      // Correct the image format
      base64 = base64.replace(/_/g, '/');
      base64 = base64.replace(/-/g, '+');
    } else {
      console.log("Fingerprint not captured");
    }

    this.currentImageFinger = base64;
    console.log("Captured image");
  }

  /**
   * Fixes the format of a base64 image.
   * @param base64Image The base64 image to fix.
   * @returns The fixed base64 image.
   */
  fn_fixFormat(base64Image: any) {
    var strImage = base64Image;
    strImage = strImage.replace(/_/g, '/');
    strImage = strImage.replace(/-/g, '+');
    return strImage;
  }
}
