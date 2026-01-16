import * as SQLite from 'expo-sqlite'
import type { PhotoMetadata, PhotoFilter } from '../types/photo'

class PhotoStorageService {
  private db: SQLite.SQLiteDatabase | null = null

  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync('geomark.db')

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS photos (
        id TEXT PRIMARY KEY,
        uri TEXT NOT NULL,
        thumbnail_uri TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        altitude REAL,
        accuracy REAL,
        timestamp INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        note TEXT,
        address TEXT,
        file_size INTEGER,
        width INTEGER,
        height INTEGER,
        is_deleted INTEGER DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_photos_timestamp ON photos(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_photos_location ON photos(latitude, longitude);
    `)
  }

  async savePhoto(photo: PhotoMetadata): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.runAsync(
      `INSERT INTO photos (
        id, uri, thumbnail_uri, latitude, longitude, altitude, accuracy,
        timestamp, created_at, updated_at, note, address, file_size, width, height
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        photo.id,
        photo.uri,
        photo.thumbnailUri || null,
        photo.coordinates.latitude,
        photo.coordinates.longitude,
        photo.coordinates.altitude || null,
        photo.coordinates.accuracy || null,
        photo.timestamp,
        photo.createdAt,
        photo.updatedAt,
        photo.note || null,
        photo.address || null,
        photo.fileSize || null,
        photo.dimensions?.width || null,
        photo.dimensions?.height || null,
      ]
    )
  }

  async getPhotos(filter?: PhotoFilter): Promise<PhotoMetadata[]> {
    if (!this.db) throw new Error('Database not initialized')

    let query = 'SELECT * FROM photos WHERE is_deleted = 0'
    const params: any[] = []

    if (filter?.dateFrom) {
      query += ' AND timestamp >= ?'
      params.push(filter.dateFrom)
    }

    if (filter?.dateTo) {
      query += ' AND timestamp <= ?'
      params.push(filter.dateTo)
    }

    if (filter?.searchQuery) {
      query += ' AND (note LIKE ? OR address LIKE ?)'
      params.push(`%${filter.searchQuery}%`, `%${filter.searchQuery}%`)
    }

    query += ' ORDER BY timestamp DESC'

    const result = await this.db.getAllAsync(query, params)
    return this.mapResultToPhotos(result as any[])
  }

  async getPhotoById(id: string): Promise<PhotoMetadata | null> {
    if (!this.db) throw new Error('Database not initialized')

    const result = await this.db.getFirstAsync(
      'SELECT * FROM photos WHERE id = ? AND is_deleted = 0',
      [id]
    )

    if (!result) return null
    return this.mapRowToPhoto(result as any)
  }

  async updatePhoto(id: string, updates: Partial<PhotoMetadata>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const fields: string[] = []
    const values: any[] = []

    if (updates.note !== undefined) {
      fields.push('note = ?')
      values.push(updates.note)
    }

    if (updates.address !== undefined) {
      fields.push('address = ?')
      values.push(updates.address)
    }

    fields.push('updated_at = ?')
    values.push(Date.now())

    values.push(id)

    await this.db.runAsync(
      `UPDATE photos SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
  }

  async deletePhoto(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.runAsync(
      'UPDATE photos SET is_deleted = 1, updated_at = ? WHERE id = ?',
      [Date.now(), id]
    )
  }

  async getPhotoCount(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized')

    const result = await this.db.getFirstAsync(
      'SELECT COUNT(*) as count FROM photos WHERE is_deleted = 0'
    )
    return (result as any)?.count || 0
  }

  private mapResultToPhotos(rows: any[]): PhotoMetadata[] {
    return rows.map(this.mapRowToPhoto)
  }

  private mapRowToPhoto(row: any): PhotoMetadata {
    return {
      id: row.id,
      uri: row.uri,
      thumbnailUri: row.thumbnail_uri,
      coordinates: {
        latitude: row.latitude,
        longitude: row.longitude,
        altitude: row.altitude,
        accuracy: row.accuracy,
      },
      timestamp: row.timestamp,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      note: row.note,
      address: row.address,
      fileSize: row.file_size,
      dimensions:
        row.width && row.height
          ? { width: row.width, height: row.height }
          : undefined,
    }
  }
}

export const PhotoStorage = new PhotoStorageService()
