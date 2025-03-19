import Logo from '../../assets/logo.png';
import { IoShareSocialOutline } from 'react-icons/io5';
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from 'react-icons/hi';
import { useAtom } from 'jotai';
import { showCanvasAtom } from '@renderer/state/canvas';
import { isReportHtmlMode } from '@renderer/constants';
import { useAppChat } from '@renderer/hooks/useAppChat';
import { useDisclosure } from '@nextui-org/react';
import { ShareModal } from './ShareModal';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function MenuHeader() {
  const [showCanvas, setShowCanvas] = useAtom(showCanvasAtom);
  const { messages } = useAppChat();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isShareHovered, setIsShareHovered] = useState(false);
  const [isPanelHovered, setIsPanelHovered] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b border-divider backdrop-blur-md backdrop-saturate-150 px-6 py-3 sticky top-0 z-10 shadow-sm"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <motion.div
          className="flex items-center justify-center space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {/* Logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm overflow-hidden">
            <motion.img
              src={Logo}
              alt="Agent TARS Logo"
              className="w-6 h-6 object-contain"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </div>

          {/* Brand name */}
          <motion.span
            className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Agent TARS
          </motion.span>
        </motion.div>

        <div className="flex items-center space-x-4">
          {!isReportHtmlMode && (
            <motion.button
              onMouseEnter={() => setIsShareHovered(true)}
              onMouseLeave={() => setIsShareHovered(false)}
              onClick={onOpen}
              className="p-2.5 rounded-xl bg-background hover:bg-primary/5 border border-divider hover:border-primary/30 transition-all duration-200 relative group"
              title="Share"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoShareSocialOutline
                size={20}
                className={`${isShareHovered ? 'text-primary' : 'text-foreground/70'} transition-colors duration-200`}
              />
              <motion.span
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={
                  isShareHovered
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 10, scale: 0.8 }
                }
                className="absolute -bottom-8 left-0 transform -translate-x-1/2 text-xs bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md border border-divider whitespace-nowrap"
              >
                Share
              </motion.span>
            </motion.button>
          )}

          {/* Toggle Panel Button */}
          <motion.button
            onMouseEnter={() => setIsPanelHovered(true)}
            onMouseLeave={() => setIsPanelHovered(false)}
            onClick={() => setShowCanvas(!showCanvas)}
            className="p-3 rounded-xl bg-background hover:bg-primary/5 border border-divider hover:border-primary/30 transition-all duration-200 relative group"
            title={showCanvas ? 'Hide Panel' : 'Show Panel'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {showCanvas ? (
                <HiOutlineChevronDoubleRight
                  size={20}
                  className={`${isPanelHovered ? 'text-primary' : 'text-foreground/70'} transition-colors duration-200`}
                />
              ) : (
                <HiOutlineChevronDoubleLeft
                  size={20}
                  className={`${isPanelHovered ? 'text-primary' : 'text-foreground/70'} transition-colors duration-200`}
                />
              )}
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={
                isPanelHovered
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 10, scale: 0.8 }
              }
              className="absolute -bottom-8 left-0 transform -translate-x-1/4 text-xs bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md border border-divider whitespace-nowrap"
            >
              {showCanvas ? 'Hide' : 'Show'}
            </motion.span>
          </motion.button>
        </div>
      </div>

      <ShareModal isOpen={isOpen} onClose={onClose} messages={messages} />
    </motion.header>
  );
}
