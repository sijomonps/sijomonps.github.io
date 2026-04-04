// 导入必要的React hooks和MUI组件
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'

// 定义组件Props类型
type Props = {
  sectionId: string;  // 用于监听的section ID
  gradientColors: {   // 渐变色配置
    start: string;    // 起始颜色
    end: string;      // 结束颜色
  };
}

export default function GradientBackground({ sectionId, gradientColors }: Props) {
  // 控制渐变背景是否可见的状态
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 创建交叉观察器实例来监听section的可见性
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 }  // 当30%的内容可见时触发回调
    )

    // 获取并观察目标section元素
    const section = document.getElementById(sectionId)
    if (section) {
      observer.observe(section)
    }

    // 清理函数：组件卸载时断开观察器
    return () => observer.disconnect()
  }, [sectionId])

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          width: {
            xs: '200px',
            sm: '400px'
          },
          height: {
            xs: '200px',
            sm: '500px'
          },
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
          filter: {
            xs: 'blur(40px)',
            sm: 'blur(80px)'
          },
          bottom: {
            xs: '-40px',
            sm: '-100px'
          },
          right: {
            xs: '-40px',
            sm: '-100px'
          },
          opacity: isVisible ? 0.3 : 0,
          transition: 'opacity 0.8s ease-in-out',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          width: {
            xs: '300px',
            sm: '500px'
          },
          height: {
            xs: '300px',
            sm: '500px'
          },
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${gradientColors.end}, ${gradientColors.start})`,
          filter: {
            xs: 'blur(40px)',
            sm: 'blur(80px)'
          },
          bottom: {
            xs: '-40px',
            sm: '-100px'
          },
          left: {
            xs: '-40px',
            sm: '-100px'
          },
          opacity: isVisible ? 0.3 : 0,
          transition: 'opacity 0.8s ease-in-out',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
    </>
  )
} 