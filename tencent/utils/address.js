const multiIndex = [0, 0, 0]
const multiArray = [
  ['无脊柱动物', '脊柱动物'], 
  ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], 
  ['猪肉绦虫', '吸血虫']
]
const objectMultiArray = [
  [
    {
      id: 0,
      name: '无脊柱动物'
    },
    {
      id: 1,
      name: '脊柱动物'
    }
  ], [
    {
      id: 0,
      name: '扁性动物'
    },
    {
      id: 1,
      name: '线形动物'
    },
    {
      id: 2,
      name: '环节动物'
    },
    {
      id: 3,
      name: '软体动物'
    },
    {
      id: 3,
      name: '节肢动物'
    }
  ], [
    {
      id: 0,
      name: '猪肉绦虫'
    },
    {
      id: 1,
      name: '吸血虫'
    }
  ]
]

module.exports = {
  multiArray,
  objectMultiArray,
  multiIndex
}
  