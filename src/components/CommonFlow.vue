<template>
  <div id="diagram"></div>
</template>
<script>
import go from 'gojs'
export default {
  name: 'CommonFlow',
  props: ['modelData'], // accept model data as a parameter
  data: function () {
    return {
      diagram: null
    }
  }, // provide access to the GoJS Diagram
  mounted: function () {
    var $ = go.GraphObject.make
    var self = this
    var myDiagram =
      $(go.Diagram, document.getElementById('diagram'), {
        initialContentAlignment: go.Spot.Center,
        layout: $(go.TreeLayout, {
          angle: 90,
          nodeSpacing: 20,
          layerSpacing: 90,
          arrangement: go.TreeLayout.ArrangementHorizontal
        }),
        'undoManager.isEnabled': true,
        // Model ChangedEvents get passed up to component users
        'ModelChanged': function (e) {
          self.$emit('model-changed', e)
        },
        'ChangedSelection': function (e) {
          self.$emit('changed-selection', e)
        }
      })

    myDiagram.nodeTemplate =
      $(go.Node, 'Auto',
        $(go.Shape, {
          fill: 'white',
          strokeWidth: 0,
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          cursor: 'pointer'
        },
        new go.Binding('fill', 'color')),
        $(go.TextBlock, textStyle(), {
          margin: 10,
          editable: false
        },
        new go.Binding('text').makeTwoWay()),
        {
          click: function (e, node) {
            // 单击事件,输出节点数据
            self.clickblock(node)
          },
          cursor: 'pointer' // 改变鼠标样式变成小手
        }
      )

    function textStyle () {
      return {
        font: 'bold 11pt Helvetica, Arial, sans-serif',
        stroke: 'whitesmoke'
      }
    }

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $(go.Link, // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          mouseEnter: function (e, link) {
            link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)'
          },
          mouseLeave: function (e, link) {
            link.findObject('HIGHLIGHT').stroke = 'transparent'
          },
          selectionAdorned: false
        },
        // new go.Binding("points").makeTwoWay(),
        $(go.Shape, // the highlight shape, normally transparent
          {
            isPanelMain: true,
            strokeWidth: 8,
            stroke: 'transparent',
            name: 'HIGHLIGHT'
          }),
        $(go.Shape, // the link path shape
          {
            isPanelMain: true,
            stroke: 'gray',
            strokeWidth: 2
          },
          new go.Binding('stroke', 'isSelected', function (sel) {
            return sel ? 'dodgerblue' : 'gray'
          }).ofObject()),
        $(go.Shape, // the arrowhead
          {
            toArrow: 'standard',
            strokeWidth: 0,
            fill: 'gray'
          }),
        $(go.Panel, 'Auto', // the link label, normally not visible
          {
            visible: false,
            name: 'LABEL',
            segmentIndex: 2,
            segmentFraction: 0.5
          },
          new go.Binding('visible', 'visible').makeTwoWay(),
          $(go.Shape, 'RoundedRectangle', // the label shape
            {
              fill: '#F8F8F8',
              strokeWidth: 0
            }),
          $(go.TextBlock, 'Yes', // the label
            {
              textAlign: 'center',
              font: '10pt helvetica, arial, sans-serif',
              stroke: '#333333',
              editable: true
            },
            new go.Binding('text').makeTwoWay())
        )
      )

    this.diagram = myDiagram

    this.updateModel(this.modelData)
  },
  watch: {
    modelData: function (val) {
      this.updateModel(val)
    }
  },
  methods: {
    clickblock: function (node) {
      this.$emit('frommodel', node.part.data)
    },
    model: function () {
      return this.diagram.model
    },
    updateModel: function (val) {
      // No GoJS transaction permitted when replacing Diagram.model.
      if (val instanceof go.Model) {
        this.diagram.model = val
      } else {
        var m = new go.GraphLinksModel()
        if (val) {
          for (var p in val) {
            m[p] = val[p]
          }
        }
        this.diagram.model = m
      }
    },
    updateDiagramFromData: function () {
      this.diagram.startTransaction()
      // This is very general but very inefficient.
      // It would be better to modify the diagramData data by calling
      // Model.setDataProperty or Model.addNodeData, et al.
      this.diagram.updateAllRelationshipsFromData()
      this.diagram.updateAllTargetBindings()
      this.diagram.commitTransaction('updated')
    }
  }
}
</script>
<style scoped>
</style>
