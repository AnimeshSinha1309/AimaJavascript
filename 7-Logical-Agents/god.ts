import { Grid } from "./grid";
import { Tile } from "./tile";

export class GodSight {

  private readonly canvas: any;
  private readonly CENTERS: number[] = [];
  private readonly BLOCK_SIZE: number;
  private readonly GRID_SIZE: number;
  private tiles: Tile[][] = [];

  constructor(game: Grid) {
    this.canvas = game.canvas.nested();
    this.BLOCK_SIZE = game.UX_SIZE / game.GRID_SIZE;
    this.GRID_SIZE = game.GRID_SIZE;
    this.tiles = game.tiles;
    for (let i = 0; i < this.GRID_SIZE; i++) {
      this.CENTERS[i] = this.BLOCK_SIZE * i + this.BLOCK_SIZE / 2;
    }
  }

  public render(): void {
    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        if (this.tiles[i][j].hasStench) {
          const s1 = this.canvas.rect(this.BLOCK_SIZE * 0.6, this.BLOCK_SIZE * 0.15);
          s1.center(this.CENTERS[i], this.CENTERS[j] - this.BLOCK_SIZE * 0.25);
          s1.fill({ color: "#ff0000", opacity: 0.5 });
        }
        if (this.tiles[i][j].hasWumpus) {
          const s2 = this.canvas.rect(this.BLOCK_SIZE * 0.6, this.BLOCK_SIZE * 0.15);
          s2.center(this.CENTERS[i], this.CENTERS[j] - this.BLOCK_SIZE * 0.10);
          s2.fill({ color: "#ff0000", opacity: 1.0 });
        }
        if (this.tiles[i][j].hasGold) {
          const s3 = this.canvas.rect(this.BLOCK_SIZE * 0.6, this.BLOCK_SIZE * 0.15);
          s3.center(this.CENTERS[i], this.CENTERS[j] + this.BLOCK_SIZE * 0.00);
          s3.fill({ color: "#ffff00", opacity: 1.0 });
        }
        if (this.tiles[i][j].hasPit) {
          const s3 = this.canvas.rect(this.BLOCK_SIZE * 0.6, this.BLOCK_SIZE * 0.15);
          s3.center(this.CENTERS[i], this.CENTERS[j] + this.BLOCK_SIZE * 0.10);
          s3.fill({ color: "#000000", opacity: 1.0 });
        }
        if (this.tiles[i][j].hasBreeze) {
          const s4 = this.canvas.rect(this.BLOCK_SIZE * 0.6, this.BLOCK_SIZE * 0.15);
          s4.center(this.CENTERS[i], this.CENTERS[j] + this.BLOCK_SIZE * 0.25);
          s4.fill({ color: "#000000", opacity: 0.5 });
        }
      }
    }
  }
}
