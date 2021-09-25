import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Position } from 'geojson';
import { HttpClient } from '@angular/common/http';

import * as segmentsExample from 'src/assets/segments_example.json';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  constructor(private httpClient: HttpClient) { }

  _transformSegmentsExampleToGeoJson(input: Object): {} {
    let arrayOfPoints = [];
    for (const [key, value] of Object.entries(input)) {
      arrayOfPoints.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [value.Longitude, value.Latitude] as Position
        },
        properties: {
          A2_RSSI: Number.parseFloat(value.A2_RSSI),
          dateOfFailure: '2021-09-26',
          segment: key,
          longitude: value.Longitude,
          latitude: value.Latitude,
        }
      });
    }

    const geoJsonObject = {
      type: 'FeatureCollection',
      features: arrayOfPoints
    }

    return geoJsonObject;
  }

  _httpGetMarkers(): Observable<{}> {
    return this.httpClient.get<{}>(`${environment.apiUrl}/getMarkers`);
  }

  _httpGetGraphData(segmentNumber: number): Observable<{}> {
    const body = { segmentNumber }
    return this.httpClient.post<{}>(`${environment.apiUrl}/getGraphData`, body);
  }

  getMarkers(): Observable<{}> {
    return this._httpGetMarkers();
  }

  getSegmentGraphData(segmentNumber: number): Observable<{}> {
    return this._httpGetGraphData(segmentNumber);
  }
}

export class MockMarkersService extends MarkersService {
  getMarkers(): Observable<{}> {
    return new Observable(observer => {
      const geoJsonData = this._transformSegmentsExampleToGeoJson(segmentsExample);
      observer.next(geoJsonData);
    });
  }

  getSegmentGraphData(segmentNumber: number): Observable<{}> {
    return new Observable(observer => {
      const mockGraphData = {
        segmentNumber: segmentNumber,
        labels: ["2021-09-25", "2021-09-26", "2021-09-27", "2021-09-28", "2021-09-29", "2021-09-30"],
        data: [3, 2.5, 2, 1.5, 1, 0.5],
      }
      observer.next(mockGraphData);
    });
  }
}