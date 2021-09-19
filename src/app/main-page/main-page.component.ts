import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../core/services/spotify.service';
import { Router } from '@angular/router';
import { TrackInfo } from '../core/models/track-info.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  playlistInfo: any = [];
  tracksInfo: any = [];
  trackList: any = [];

  constructor(private router: Router,
              private spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    this.checkRefreshToken();
    this.onPlaylistLoad();
  }

  onPlaylistLoad(): void {
    this.spotifyService.getPlaylists().subscribe((data: any) => {
      let items = data.items;
      if (items) {
        this.playlistInfo = items;
      }
    });
  }

  showMusic(item: any): void {
    let trackInfo = new TrackInfo();
    trackInfo.playlistId = item.id;
    trackInfo.playlistName = item.name;
    this.spotifyService.getTracks(trackInfo.playlistId).subscribe((data: any) => {
      trackInfo.items = data.items;
      this.addTracks(trackInfo);
    });
  }

  addTracks(trackInfo: TrackInfo): void {
    let index = this.tracksInfo.findIndex((element: any) => {
      return element.playlistId === trackInfo.playlistId;
    });
    if (index > -1) {
      this.tracksInfo.splice(index, 1);
      this.deleteRelatedTracks(trackInfo.items);
    } else {
      this.tracksInfo.push(trackInfo);
      this.updateShownTracks(trackInfo.items);
    }
  }

  updateShownTracks(itemTracks: any): void {
    itemTracks.forEach((newTrack: any) => {
      let isAlreadyExist = this.trackList.some((alreadyAddedTrack: any) => {
        return alreadyAddedTrack.track.id === newTrack.track.id;
      });
      if (!isAlreadyExist) {
        this.trackList.push(newTrack);
      }
    });
  }

  deleteRelatedTracks(itemTracks: any): void {
    itemTracks.forEach((newTrack: any) => {
      let index = this.trackList.findIndex((alreadyAddedTrack: any) => {
        return alreadyAddedTrack.track.id === newTrack.track.id;
      });
      if (index > -1 && !this.checkIfExistInDiffrentPlaylist(newTrack)) {
        this.trackList.splice(index, 1);
      }
    });
  }

  checkIfExistInDiffrentPlaylist(track: any): boolean {
    let exists = false;
    this.tracksInfo.forEach((info: any) => {
      exists = info.items.some((alreadyAddedTrack: any) => {
        return alreadyAddedTrack.track.id === track.track.id;
      });
    });
    return exists;
  }

  checkIfExistInPlaylist(item: any, trackInfo: TrackInfo): boolean {
    let exists = false;
    exists = trackInfo.items.some((song: any) => {
      return song.track.id === item.track.id;
    });
    return exists;
  }

  manageSongOnPlaylist(item: any, trackInfo: TrackInfo): void {
    let exists = this.checkIfExistInPlaylist(item, trackInfo);
    if (exists) {

    } else {
      let trackUri = item.track.uri;
      this.spotifyService.addTrackToPlaylist(trackInfo.playlistId, trackUri).subscribe(() => {
        this.spotifyService.getTracks(trackInfo.playlistId).subscribe((data: any) => {
          trackInfo.items = data.items;
          let indexOfTrackInfo = this.tracksInfo.findIndex((trackInfoAdded: TrackInfo) => {
            return trackInfoAdded.playlistId === trackInfo.playlistId;
          });
          this.tracksInfo[indexOfTrackInfo] = trackInfo;
        });;
      });
    }
  }

  logout(): void {
    this.spotifyService.logout();
  }

  private checkRefreshToken(): void {
    if (this.spotifyService.refreshToken == null) {
      this.router.navigate(['./']);
    }
  }

}