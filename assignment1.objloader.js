load() {
        // Load the file's contents
        let contents = loadExternalFile(this.filename);

        // Create lists for vertices and indices
        let vertices = [];
        let indices = [];

        // Parse the file's contents
        let lines = contents.split('\n');
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('v ')) {
                vertices.push(...this.parseVertex(line));
            } else if (line.startsWith('f ')) {
                indices.push(...this.parseFace(line));
            }
        }

        // Normalize vertices
        let maxExtent = Math.max(...vertices);
        let minExtent = Math.min(...vertices);
        let scale = 2 / (maxExtent - minExtent);
        let offset = -(maxExtent + minExtent) / 2;
        vertices = vertices.map(v => v * scale + offset);

        // Return the tuple
        return [vertices, indices];
    }

    parseVertex(vertex_string) {
        let parts = vertex_string.split(/\s+/).slice(1);  // split by whitespace and ignore the first element ('v')
        return parts.map(coord => parseFloat(coord));
    }

    parseFace(face_string) {
        let parts = face_string.split(/\s+/).slice(1);  // split by whitespace and ignore the first element ('f')
        if (parts.length === 4) {
            return this.triangulateFace(parts.map(part => parseInt(part.split('/')[0]) - 1));
        } else {
            return parts.map(part => parseInt(part.split('/')[0]) - 1);
        }
    }

    triangulateFace(face) {
        // Assume the face is a quad and create two triangles from it
        let [a, b, c, d] = face;
        return [a, b, c, a, c, d];
    }
}
