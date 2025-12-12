# Media File Size Guidelines

## Hosting Platform Limits

### Netlify (Your Current Setup)
- **Total site size**: No hard limit, but recommended under 1GB for free tier
- **Individual file size**: No hard limit, but files over 100MB may timeout
- **Build timeout**: 15 minutes (free tier)
- **Bandwidth**: 100GB/month (free tier)

**Recommendation**: Keep individual files under 50MB for reliable delivery.

---

## Recommended File Sizes for Web

### Images (JPG, PNG, WebP)

**For Grid Thumbnails:**
- **Dimensions**: 800x800px to 1200x1200px (square for your grid)
- **File Size**: **Under 200KB per image**
- **Format**: 
  - JPEG for photos (best compression)
  - PNG for graphics with transparency
  - WebP for modern browsers (best compression, ~30% smaller than JPEG)

**For Full-Screen/Lightbox View:**
- **Dimensions**: 1920x1920px max (or maintain aspect ratio)
- **File Size**: **Under 500KB per image**
- **Format**: Same as above

**Best Practices:**
- Use image compression tools before uploading
- Consider lazy loading (already implemented in your grid)
- Use responsive images for different screen sizes

---

### Videos (MP4)

**For Web Portfolio:**
- **Resolution**: 720p (1280x720) or 1080p (1920x1080) max
- **File Size**: **Under 50MB per video** (ideally 10-20MB)
- **Format**: MP4 (H.264 codec)
- **Duration**: Keep videos short (under 2 minutes for portfolio)
- **Bitrate**: 2-5 Mbps for web

**Best Practices:**
- Compress videos before uploading
- Consider using video hosting (YouTube, Vimeo) and embedding
- Use poster images for video thumbnails
- Consider autoplay with muted attribute

**Tools for Compression:**
- HandBrake (free, desktop)
- FFmpeg (command line)
- CloudConvert (online)

---

### GIFs

**For Web:**
- **Dimensions**: 800x800px max
- **File Size**: **Under 5MB per GIF** (ideally under 2MB)
- **Frame Rate**: 15-24 fps (lower = smaller file)
- **Color Palette**: Reduce to 256 colors or less
- **Duration**: Keep loops short (2-5 seconds)

**Best Practices:**
- Consider converting to MP4 video instead (much smaller file size)
- Use tools like EZGIF or GIFsicle to optimize
- Limit number of GIFs per page

**Alternative to GIFs:**
- Use MP4 videos with `autoplay loop muted` (much smaller files)
- Use CSS animations for simple effects
- Use WebP animated format (better compression)

---

## Performance Impact

### Page Load Times (Target: Under 3 seconds)
- **10 images @ 200KB each** = 2MB total = ~2-4 seconds on fast connection
- **1 video @ 20MB** = ~3-5 seconds on fast connection
- **5 GIFs @ 2MB each** = 10MB total = ~5-10 seconds (not recommended)

### User Experience
- **Mobile users**: Keep files smaller (they may be on slower connections)
- **Lazy loading**: Already implemented - images load as user scrolls
- **Progressive loading**: Consider showing low-res thumbnails first

---

## Optimization Tools

### Images
1. **TinyPNG** (https://tinypng.com/) - Compress PNG/JPEG
2. **Squoosh** (https://squoosh.app/) - Google's image optimizer
3. **ImageOptim** (Mac app) - Batch compression
4. **Sharp** (Node.js) - Programmatic optimization

### Videos
1. **HandBrake** - Free video compression
2. **FFmpeg** - Command line tool
3. **CloudConvert** - Online conversion

### GIFs
1. **EZGIF** (https://ezgif.com/) - Online GIF optimizer
2. **GIFsicle** - Command line tool
3. **Convert to MP4** - Often 90% smaller file size

---

## Recommended Workflow

### Before Adding Media:

1. **Optimize all images:**
   ```bash
   # Example: Compress images to under 200KB
   # Use TinyPNG, Squoosh, or ImageOptim
   ```

2. **Compress videos:**
   ```bash
   # Use HandBrake to reduce file size
   # Target: 720p, 2-5 Mbps bitrate
   ```

3. **Optimize GIFs:**
   ```bash
   # Use EZGIF or convert to MP4
   # Target: Under 2MB
   ```

4. **Test locally:**
   ```bash
   npm run build
   npm run preview
   # Check page load times
   ```

5. **Check total site size:**
   ```bash
   du -sh dist/
   # Should be under 500MB ideally
   ```

---

## File Structure Recommendations

```
public/
  images/
    thumbnails/     # 800x800px, <200KB each
    fullsize/       # 1920x1920px, <500KB each
  videos/
    portfolio/      # 720p-1080p, <50MB each
  gifs/             # <2MB each (or use videos instead)
```

---

## Quick Reference

| Media Type | Max Dimensions | Max File Size | Format |
|------------|---------------|---------------|--------|
| **Grid Images** | 1200x1200px | 200KB | JPEG/WebP |
| **Full Images** | 1920x1920px | 500KB | JPEG/WebP |
| **Videos** | 1080p | 50MB | MP4 (H.264) |
| **GIFs** | 800x800px | 2MB | GIF (or MP4) |

---

## Important Notes

1. **Netlify Free Tier**: 100GB bandwidth/month
   - If you expect high traffic, consider upgrading or using CDN

2. **Build Time**: Large files increase build time
   - Keep total site under 500MB for reasonable builds

3. **Mobile Users**: Always test on mobile connections
   - Consider lower quality versions for mobile

4. **Lazy Loading**: Already implemented in your grid
   - Images load as user scrolls (good for performance)

5. **Alternative Hosting**: For very large files
   - Use Cloudinary, Imgix, or AWS S3 for media
   - Embed videos from YouTube/Vimeo

---

## Testing Your Site

After adding media, test:
1. Page load time (should be under 3 seconds)
2. Mobile performance (use Chrome DevTools)
3. Network throttling (test on slow 3G)
4. Total site size (check `dist/` folder after build)









