export default class Room {
    constructor(scene, id) {
        this.scene = scene
        this.id = id
    }

    create() {
        this.scene.game.socket.emit('newRoom', this.id)

        this.registerEvents()
    }

    registerEvents() {
        this.scene.game.socket.on('newRoom', room => {
            this.addRoom(room)
        })

        this.scene.game.socket.on('newItem', item => {
            this.loadItem(0, 0, 0, this.depth + 2, item)
        })
    }

    addRoom(room) {
        room.model.map.forEach((squares, row) => {
            squares.forEach((square, index) => {
                let x = row * 32 + index * 32
                let y = (row * 32 - index * 32) / 2
                let z = square[1] * 32 || 0
                let height = square[1] || 0
                this.depth = row - index

                if (!room.hideWall) {
                    if (this.isLeftWall(room.model.map[row - 1], index)) {
                        this.addLeftWall(x, y, room.wallThickness, this.depth)
                    }

                    if (this.isRightWall(squares[index + 1])) {
                        this.addRightWall(x, y, room.wallThickness, this.depth)
                    }
                }

                var tile = this.scene.add.image(x, y - z, 'tile')
                
                tile.setDepth(this.depth + height)
                tile.setInteractive({ pixelPerfect: true })
                // var tileOffset
                // var wallOffset
                // var hoverTileOffset

                // switch (room.floorThickness) {
                //     // case 0:

                //     //     tile = this.scene.add.image(x, y - z, 'tile', 'thinnest')
                //     //     hoverTileOffset = 0
                //     //     wallOffset = 0
                //     //     break

                //     // case 1:
                //     //     //tile = this.scene.add.image(x, y - z, 'tile', 'thin')
                //     //     tile = this.scene.add.image(x, y - z, 'tile')
                //     //     hoverTileOffset = 0.03
                //     //     wallOffset = 0.01
                //     //     break

                //     case 2:
                //         if (leftEdge && rightEdge) {
                //             tile = this.scene.add.image(x - 1, y - z + 1, 'tile_border')
                //         }

                //         else if (leftEdge) {
                //             tile = this.scene.add.image(x - 1, y - z, 'tile_left_edge')
                //         }

                //         else if (rightEdge) {
                //             tile = this.scene.add.image(x - 1, y - z, 'tile_right_edge')
                //         }

                //         else {
                //             tile = this.scene.add.image(x, y - z, 'tile')
                //         }
                //         break

                //     // case 3:
                //     //     tile = this.scene.add.image(x, y - z, 'tile', 'thick')
                //     //     break
                // }

                // var tile = this.scene.add.image(x, y - z, 'tile')

                /* 1:1: lack of accurate calculation leds me to use images, so I have to calculate the edges and cut the pixels

                    leftEdge: leftPixels cropped image (for each size)
                    rightEdge: rightPixels cropped image (for each size)
                    border: rightPixels and leftPixels cropped image (for each size)
                */

                // tile.setDepth(depth)
                // tile.setInteractive({ pixelPerfect: true })

                // tile.on('pointerover', () => {
                //     this.addHoverTile(x, y, z, this.depth + 1)
                // })

                // tile.on('pointerout', () => {
                //     this.destroyHoverTile()
                // })
            })
        })
    }

    addHoverTile(x, y, z, depth) {
        this.hoverTile = this.scene.add.image(x, y - z, 'tile_hover').setDepth(depth).setOrigin(0.5, 0.6)
    }

    destroyHoverTile() {
        this.hoverTile.destroy()
    }

    isLeftWall(topSquares, index) {
        if (topSquares === undefined) {
            return true

        } else {

            if (topSquares[index] === undefined) {
                return true
            }
        }

        return false
    }

    addLeftWall(x, y, thickness, depth) {
        this.scene.add.image(x, y, 'wall_left').setDepth(depth).setOrigin(1.02, 0.97)
    }

    isRightWall(rightSquare) {
        return rightSquare === undefined
    }

    addRightWall(x, y, thickness, depth) {
        this.scene.add.image(x, y, 'wall_right').setDepth(depth - 1).setOrigin(0.02, 0.97)
    }

    loadItem(x, y, z, depth, spriteName) {
        this.scene.load.once('complete', () => {
            this.addItem(x, y, z, depth, spriteName)
        })

        this.scene.load.setPath('web-build/furniture/')
        this.scene.load.image(spriteName, `${spriteName}.png`)
        this.scene.load.start()
    }

    addItem(x, y, z, depth, name) {
        this.scene.add.image(x, y - z, name).setDepth(depth).setOrigin(0.5, 0.95)
    }
}