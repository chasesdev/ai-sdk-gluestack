import { useState, useRef } from 'react';
import { ScrollView, View, Switch as RNSwitch, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Spinner,
  Progress,
  ProgressFilledTrack,
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  Divider,
  Badge,
  BadgeText,
  Icon,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
  AccordionContentText,
  Fab,
  FabIcon,
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Tooltip,
  TooltipContent,
  TooltipText,
} from '@gluestack-ui/themed';
import { ComponentSection } from '../components/ComponentSection';
import { DemoCard } from '../components/DemoCard';
import { WorkflowPlanner, exampleNodes, exampleEdges } from '../components/workflow';
import { Connection } from '../components/ai-sdk/Connection';
import { Actions } from '../components/ai-sdk/Actions';
import { AIChatbot } from '../components/ai-sdk/AIChatbot';
import type { ActionItem, ConnectionStatus } from '../components/ai-sdk/types';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, CircleIcon, CloseIcon, AddIcon, InfoIcon } from '@gluestack-ui/themed';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../constants/theme';
import {
  ThemedHeading,
  ThemedText,
  ThemedCard,
  ThemedBox,
  ResponsiveContainer,
} from '../components/themed';

export default function ComponentsPage() {
  // Theme-aware colors (still needed for some demo content)
  const { resolvedTheme } = useTheme();
  const colors = getThemeColors(resolvedTheme === 'dark');
  const { text: textColor, mutedText: mutedTextColor, tintedBg } = colors;

  // State for interactive components
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [sliderValue, setSliderValue] = useState(50);
  const [switchValue, setSwitchValue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertDialogVisible, setAlertDialogVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(45);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [tocExpanded, setTocExpanded] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<{ [key: string]: View | null }>({});
  const containerRef = useRef<View>(null);

  const toast = useToast();

  const sections = [
    { id: 'foundation', title: 'Foundation', description: 'Layout, typography, and core building blocks' },
    { id: 'interactions', title: 'Inputs & Actions', description: 'Buttons, forms, and user interactions' },
    { id: 'feedback', title: 'Feedback & Navigation', description: 'Alerts, modals, navigation, and media components' },
    { id: 'ai-sdk', title: 'AI Components', description: 'AI SDK components and workflow visualization' },
  ];

  const scrollToSection = (sectionId: string) => {
    const sectionRef = sectionRefs.current[sectionId];
    if (sectionRef && containerRef.current && scrollViewRef.current) {
      sectionRef.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          scrollViewRef.current?.scrollTo({ y: y - 40, animated: true });
        },
        () => {
          // Fallback to measureInWindow if measureLayout fails
          sectionRef.measureInWindow((x, y, width, height) => {
            containerRef.current?.measureInWindow((cx, cy) => {
              scrollViewRef.current?.scrollTo({ y: y - cy - 40, animated: true });
            });
          });
        }
      );
    }
  };

  const showToast = () => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <Toast nativeID={id} action="success" variant="solid">
          <VStack space="xs">
            <ToastTitle>Success!</ToastTitle>
            <ToastDescription>
              This is a toast notification
            </ToastDescription>
          </VStack>
        </Toast>
      ),
    });
  };

  return (
    <>
      <ScrollView ref={scrollViewRef} className="flex-1" contentInsetAdjustmentBehavior="automatic">
        <ResponsiveContainer>
          <View ref={containerRef}>
            {/* Header */}
            <Animated.View entering={FadeIn.duration(400)}>
              <VStack sx={{ marginBottom: '$6' }}>
                <VStack space="sm">
                  <ThemedHeading size="xl">Gluestack UI Showcase</ThemedHeading>
                  <ThemedText variant="muted" size="lg">
                    Interactive demo of all 35+ components
                  </ThemedText>
                </VStack>
                <Divider />
              </VStack>
            </Animated.View>

            {/* Table of Contents */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              {tocExpanded ? (
                <Box sx={{ marginBottom: '$4' }}>
                  <Button variant="link" onPress={() => setTocExpanded(false)}>
                    <ThemedText>Table of Contents</ThemedText>
                    <Icon as={ChevronUpIcon} size="sm" />
                  </Button>
                  <VStack space="sm" sx={{ paddingVertical: '$2', marginTop: '$2' }}>
                    {sections.map((section, index) => (
                      <HStack key={section.id} space="sm" className="items-center">
                        <ThemedText variant="muted" size="sm" sx={{ minWidth: 30 }}>
                          {index + 1}.
                        </ThemedText>
                        <Button
                          variant="link"
                          size="sm"
                          onPress={() => {
                            scrollToSection(section.id);
                            setTocExpanded(false);
                          }}
                        >
                          <ThemedText>{section.title}</ThemedText>
                        </Button>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              ) : (
                <Button variant="link" onPress={() => setTocExpanded(true)} sx={{ marginBottom: '$4' }}>
                  <ThemedText>Table of Contents</ThemedText>
                  <Icon as={ChevronDownIcon} size="sm" />
                </Button>
              )}
            </Animated.View>

        {/* Foundation */}
        <View
          ref={(ref) => {
            if (ref) sectionRefs.current['foundation'] = ref;
          }}
        >
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Accordion defaultValue={["foundation"]} type="single" collapsable>
            <AccordionItem value="foundation">
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => (
                    <>
                      <AccordionTitleText>Foundation</AccordionTitleText>
                      <AccordionIcon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
                    </>
                  )}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <AccordionContentText>
                  <ComponentSection
                    title="Layout & Container"
                    description="Components for structuring and organizing your UI"
                  >
            <DemoCard title="Box, VStack & HStack" description="Flexible layout containers">
              <VStack space="md">
                <Box className="p-4 rounded-lg" style={{ backgroundColor: tintedBg, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ color: textColor }}>Box: Flexible container component</Text>
                </Box>
                <VStack space="sm" className="p-4 rounded-lg" style={{ backgroundColor: tintedBg, borderWidth: 1, borderColor: colors.border }}>
                  <Text fontWeight="$semibold" style={{ color: textColor }}>VStack (Vertical)</Text>
                  <Text size="sm" style={{ color: mutedTextColor }}>Item 1</Text>
                  <Text size="sm" style={{ color: mutedTextColor }}>Item 2</Text>
                  <Text size="sm" style={{ color: mutedTextColor }}>Item 3</Text>
                </VStack>
                <HStack space="sm" className="p-4 rounded-lg" style={{ backgroundColor: tintedBg, borderWidth: 1, borderColor: colors.border }}>
                  <Text fontWeight="$semibold" style={{ color: textColor }}>HStack:</Text>
                  <Badge style={{ backgroundColor: colors.accent }}>
                    <BadgeText style={{ color: '#ffffff' }}>Horizontal</BadgeText>
                  </Badge>
                  <Badge style={{ backgroundColor: colors.accent }}>
                    <BadgeText style={{ color: '#ffffff' }}>Layout</BadgeText>
                  </Badge>
                </HStack>
              </VStack>
            </DemoCard>

            <DemoCard title="Divider" description="Visual separator between sections">
              <VStack space="md">
                <Text style={{ color: textColor }}>Content above divider</Text>
                <Divider />
                <Text style={{ color: textColor }}>Content below divider</Text>
              </VStack>
            </DemoCard>
                  </ComponentSection>
                  <ComponentSection
                    title="Typography"
                    description="Text components with various styles and sizes"
                  >
            <DemoCard title="Heading & Text" description="Text hierarchy components">
              <VStack space="md">
                <Heading size="2xl" style={{ color: textColor }}>Heading 2XL</Heading>
                <Heading size="xl" style={{ color: textColor }}>Heading XL</Heading>
                <Heading size="lg" style={{ color: textColor }}>Heading Large</Heading>
                <Heading size="md" style={{ color: textColor }}>Heading Medium</Heading>
                <Text size="lg" style={{ color: textColor }}>Text Large</Text>
                <Text size="md" style={{ color: textColor }}>Text Medium (default)</Text>
                <Text size="sm" style={{ color: mutedTextColor }}>Text Small (muted)</Text>
                <Text size="xs" style={{ color: mutedTextColor }}>Text Extra Small</Text>
              </VStack>
            </DemoCard>
                  </ComponentSection>
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          </Animated.View>
        </View>

        {/* Inputs & Actions */}
        <View
          ref={(ref) => {
            if (ref) sectionRefs.current['interactions'] = ref;
          }}
        >
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Accordion>
            <AccordionItem value="interactions">
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => (
                    <>
                      <AccordionTitleText>Inputs & Actions</AccordionTitleText>
                      <AccordionIcon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
                    </>
                  )}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <AccordionContentText>
                  <ComponentSection
                    title="Buttons & Actions"
                    description="Interactive button components"
                  >
            <DemoCard title="Button Variants" description="Different button styles and sizes">
              <VStack space="md">
                <HStack space="sm" className="flex-wrap">
                  <Button action="primary" onPress={showToast}>
                    <ButtonText>Primary</ButtonText>
                  </Button>
                  <Button action="secondary" variant="outline">
                    <ButtonText>Secondary</ButtonText>
                  </Button>
                  <Button action="positive">
                    <ButtonText>Positive</ButtonText>
                  </Button>
                  <Button action="negative">
                    <ButtonText>Negative</ButtonText>
                  </Button>
                </HStack>
                <HStack space="sm" className="flex-wrap">
                  <Button size="xs">
                    <ButtonText>Extra Small</ButtonText>
                  </Button>
                  <Button size="sm">
                    <ButtonText>Small</ButtonText>
                  </Button>
                  <Button size="md">
                    <ButtonText>Medium</ButtonText>
                  </Button>
                  <Button size="lg">
                    <ButtonText>Large</ButtonText>
                  </Button>
                </HStack>
                <Button variant="link">
                  <ButtonText>Link Button</ButtonText>
                </Button>
              </VStack>
            </DemoCard>

            <DemoCard title="FAB (Floating Action Button)" description="Floating action button for primary actions">
              <Box className="relative h-24 rounded-lg" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
                <Fab
                  size="md"
                  placement="bottom right"
                  className="absolute bottom-4 right-4"
                  onPress={showToast}
                >
                  <FabIcon as={AddIcon} />
                </Fab>
              </Box>
            </DemoCard>
                  </ComponentSection>
                  <ComponentSection
                    title="Form Components"
                    description="Interactive form inputs with state"
                  >
            <DemoCard title="Input" description="Text input field">
              <Input>
                <InputField
                  placeholder="Type something..."
                  value={inputValue}
                  onChangeText={setInputValue}
                />
              </Input>
              {inputValue && (
                <Text size="sm" className="mt-2" style={{ color: mutedTextColor }}>
                  You typed: {inputValue}
                </Text>
              )}
            </DemoCard>

            <DemoCard title="Textarea" description="Multi-line text input">
              <Textarea>
                <TextareaInput
                  placeholder="Enter multiple lines of text..."
                  value={textareaValue}
                  onChangeText={setTextareaValue}
                />
              </Textarea>
            </DemoCard>

            <DemoCard title="Checkbox" description="Toggle checkbox input">
              <Checkbox
                value="checked"
                isChecked={checkboxValue}
                onChange={setCheckboxValue}
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>
                  <Text style={{ color: textColor }}>I agree to the terms and conditions</Text>
                </CheckboxLabel>
              </Checkbox>
              <Text size="sm" className="mt-2" style={{ color: mutedTextColor }}>
                Status: {checkboxValue ? 'Checked ✓' : 'Unchecked'}
              </Text>
            </DemoCard>

            <DemoCard title="Radio Group" description="Select one option from a group">
              <RadioGroup value={radioValue} onChange={setRadioValue}>
                <VStack space="sm">
                  <Radio value="option1">
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>
                      <Text style={{ color: textColor }}>Option 1</Text>
                                     </RadioLabel>
                                   </Radio>
                                   <Radio value="option2">
                                     <RadioIndicator>
                                       <RadioIcon as={CircleIcon} />
                                     </RadioIndicator>
                                     <RadioLabel>
                                       <Text style={{ color: textColor }}>Option 2</Text>
                                     </RadioLabel>
                                   </Radio>
                                   <Radio value="option3">
                                     <RadioIndicator>
                                       <RadioIcon as={CircleIcon} />
                                     </RadioIndicator>
                                     <RadioLabel>
                                       <Text style={{ color: textColor }}>Option 3</Text>
                    </RadioLabel>
                  </Radio>
                </VStack>
              </RadioGroup>
              <Text size="sm" className="mt-2" style={{ color: mutedTextColor }}>
                Selected: {radioValue}
              </Text>
            </DemoCard>

            <DemoCard title="Slider" description="Range slider input">
              <VStack space="md">
                <Slider
                  value={sliderValue}
                  onChange={setSliderValue}
                  minValue={0}
                  maxValue={100}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Text size="sm" className="text-center" style={{ color: mutedTextColor }}>
                  Value: {Math.round(sliderValue)}
                </Text>
              </VStack>
            </DemoCard>

            <DemoCard title="Switch" description="Toggle switch component">
              <HStack space="md" className="items-center">
                <RNSwitch
                  value={switchValue}
                  onValueChange={setSwitchValue}
                />
                <Text style={{ color: textColor }}>
                  {switchValue ? 'Enabled' : 'Disabled'}
                </Text>
              </HStack>
            </DemoCard>
                  </ComponentSection>
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          </Animated.View>
        </View>

        {/* Feedback & Navigation */}
        <View
          ref={(ref) => {
            if (ref) sectionRefs.current['feedback'] = ref;
          }}
        >
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Accordion>
            <AccordionItem value="feedback">
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => (
                    <>
                      <AccordionTitleText>Feedback & Navigation</AccordionTitleText>
                      <AccordionIcon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
                    </>
                  )}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <AccordionContentText>
                  <ComponentSection
                    title="Feedback & Loading"
                    description="Components for showing status and loading states"
                  >
            <DemoCard title="Toast" description="Temporary notification messages">
              <Button onPress={showToast}>
                <ButtonText>Show Toast</ButtonText>
              </Button>
            </DemoCard>

            <DemoCard title="Spinner" description="Loading spinner indicator">
              <HStack space="lg" className="items-center justify-around">
                <VStack space="sm" className="items-center">
                  <Spinner size="small" />
                  <Text size="xs" style={{ color: mutedTextColor }}>Small</Text>
                </VStack>
                <VStack space="sm" className="items-center">
                  <Spinner />
                  <Text size="xs" style={{ color: mutedTextColor }}>Default</Text>
                </VStack>
                <VStack space="sm" className="items-center">
                  <Spinner size="large" />
                  <Text size="xs" style={{ color: mutedTextColor }}>Large</Text>
                </VStack>
              </HStack>
            </DemoCard>

            <DemoCard title="Progress Bar" description="Visual progress indicator">
              <VStack space="md">
                <Progress value={progressValue} className="w-full">
                  <ProgressFilledTrack />
                </Progress>
                <HStack space="sm">
                  <Button size="sm" onPress={() => setProgressValue(Math.max(0, progressValue - 10))}>
                    <ButtonText>-10%</ButtonText>
                  </Button>
                  <Button size="sm" onPress={() => setProgressValue(Math.min(100, progressValue + 10))}>
                    <ButtonText>+10%</ButtonText>
                  </Button>
                  <Text size="sm" className="ml-auto" style={{ color: mutedTextColor }}>
                    {progressValue}%
                  </Text>
                </HStack>
              </VStack>
            </DemoCard>

            <DemoCard title="Badge" description="Small status labels">
              <HStack space="sm" className="flex-wrap">
                <Badge action="success">
                  <BadgeText style={{ color: '#ffffff' }}>Success</BadgeText>
                </Badge>
                <Badge action="error">
                  <BadgeText style={{ color: '#ffffff' }}>Error</BadgeText>
                </Badge>
                <Badge action="warning">
                  <BadgeText style={{ color: '#ffffff' }}>Warning</BadgeText>
                </Badge>
                <Badge action="info">
                  <BadgeText style={{ color: '#ffffff' }}>Info</BadgeText>
                </Badge>
                <Badge action="muted">
                  <BadgeText style={{ color: textColor }}>Muted</BadgeText>
                </Badge>
              </HStack>
            </DemoCard>
                  </ComponentSection>
                  <ComponentSection
                    title="Overlays & Dialogs"
                    description="Modal, dialog, and popover components"
                  >
            <DemoCard title="Modal" description="Full-screen overlay dialog">
              <Button onPress={() => setModalVisible(true)}>
                <ButtonText>Open Modal</ButtonText>
              </Button>
              <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <ModalBackdrop />
                <ModalContent>
                  <ModalHeader>
                    <Heading size="lg">Modal Header</Heading>
                    <ModalCloseButton>
                      <Icon as={CloseIcon} />
                    </ModalCloseButton>
                  </ModalHeader>
                  <ModalBody>
                    <Text>
                      This is a modal dialog. It overlays the main content and can contain any components.
                    </Text>
                  </ModalBody>
                  <ModalFooter>
                    <HStack space="sm">
                      <Button variant="outline" onPress={() => setModalVisible(false)}>
                        <ButtonText>Cancel</ButtonText>
                      </Button>
                      <Button onPress={() => setModalVisible(false)}>
                        <ButtonText>Confirm</ButtonText>
                      </Button>
                    </HStack>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </DemoCard>

            <DemoCard title="Alert Dialog" description="Confirmation dialog">
              <Button action="negative" onPress={() => setAlertDialogVisible(true)}>
                <ButtonText>Show Alert</ButtonText>
              </Button>
              <AlertDialog isOpen={alertDialogVisible} onClose={() => setAlertDialogVisible(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <Heading size="lg">Confirm Action</Heading>
                    <AlertDialogCloseButton>
                      <Icon as={CloseIcon} />
                    </AlertDialogCloseButton>
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    <Text>
                      Are you sure you want to perform this action? This cannot be undone.
                    </Text>
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <HStack space="sm">
                      <Button variant="outline" onPress={() => setAlertDialogVisible(false)}>
                        <ButtonText>Cancel</ButtonText>
                      </Button>
                      <Button action="negative" onPress={() => {
                        setAlertDialogVisible(false);
                        showToast();
                      }}>
                        <ButtonText>Confirm</ButtonText>
                      </Button>
                    </HStack>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DemoCard>

            <DemoCard title="Tooltip" description="Contextual help text">
              <Tooltip
                placement="top"
                trigger={(triggerProps) => (
                  <Button {...triggerProps}>
                    <ButtonText>Hover me</ButtonText>
                  </Button>
                )}
              >
                <TooltipContent>
                  <TooltipText>This is a helpful tooltip!</TooltipText>
                </TooltipContent>
              </Tooltip>
            </DemoCard>
                  </ComponentSection>
                  <ComponentSection
                    title="Navigation & Disclosure"
                    description="Components for organizing and revealing content"
                  >
            <DemoCard title="Accordion" description="Collapsible content sections">
              <Accordion>
                <AccordionItem value="item-1">
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }: { isExpanded: boolean }) => (
                        <>
                          <AccordionTitleText>What is Gluestack UI?</AccordionTitleText>
                          <AccordionIcon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
                        </>
                      )}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>
                    <AccordionContentText>
                      Gluestack UI is a universal UI library that provides beautifully designed, accessible components for React Native and web applications.
                    </AccordionContentText>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }: { isExpanded: boolean }) => (
                        <>
                          <AccordionTitleText>Is it accessible?</AccordionTitleText>
                          <AccordionIcon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
                        </>
                      )}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>
                    <AccordionContentText>
                      Yes! All components are built with accessibility in mind and follow WAI-ARIA standards.
                    </AccordionContentText>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }: { isExpanded: boolean }) => (
                        <>
                          <AccordionTitleText>Can I customize the theme?</AccordionTitleText>
                          <AccordionIcon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
                        </>
                      )}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>
                    <AccordionContentText>
                      Absolutely! Gluestack UI provides a powerful theming system that lets you customize colors, spacing, and more.
                    </AccordionContentText>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoCard>
                  </ComponentSection>
                  <ComponentSection
                    title="Media & Display"
                    description="Avatar, image, and icon components"
                  >
            <DemoCard title="Avatar" description="User profile pictures">
              <HStack space="md" className="items-center">
                <Avatar size="sm">
                  <AvatarFallbackText>SM</AvatarFallbackText>
                </Avatar>
                <Avatar size="md">
                  <AvatarFallbackText>MD</AvatarFallbackText>
                </Avatar>
                <Avatar size="lg">
                  <AvatarFallbackText>LG</AvatarFallbackText>
                </Avatar>
                <Avatar size="xl">
                  <AvatarFallbackText>XL</AvatarFallbackText>
                </Avatar>
              </HStack>
            </DemoCard>

            <DemoCard title="Icons" description="Various icon components">
              <HStack space="lg" className="items-center justify-around">
                <VStack space="xs" className="items-center">
                  <Icon as={CheckIcon} size="xl" style={{ color: '#10b981' }} />
                  <Text size="xs" style={{ color: mutedTextColor }}>Check</Text>
                </VStack>
                <VStack space="xs" className="items-center">
                  <Icon as={CloseIcon} size="xl" style={{ color: '#ef4444' }} />
                  <Text size="xs" style={{ color: mutedTextColor }}>Close</Text>
                </VStack>
                <VStack space="xs" className="items-center">
                  <Icon as={AddIcon} size="xl" style={{ color: colors.accent }} />
                  <Text size="xs" style={{ color: mutedTextColor }}>Add</Text>
                </VStack>
                <VStack space="xs" className="items-center">
                  <Icon as={InfoIcon} size="xl" style={{ color: '#3b82f6' }} />
                  <Text size="xs" style={{ color: mutedTextColor }}>Info</Text>
                </VStack>
              </HStack>
            </DemoCard>
                  </ComponentSection>
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          </Animated.View>
        </View>

        {/* AI Components */}
        <View
          ref={(ref) => {
            if (ref) sectionRefs.current['ai-sdk'] = ref;
          }}
        >
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <Accordion>
            <AccordionItem value="ai-sdk">
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => (
                    <>
                      <AccordionTitleText>AI Components</AccordionTitleText>
                      <AccordionIcon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
                    </>
                  )}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <AccordionContentText>
                  <ComponentSection
                    title="AI SDK Components"
                    description="Specialized components for AI/ML applications"
                  >
            <DemoCard
              title="Connection Status"
              description="Real-time connection status indicator with visual feedback"
            >
              <VStack space="md">
                <Connection status="connected" message="AI service is ready" />
                <Connection status="connecting" message="Establishing connection..." />
                <Connection status="disconnected" message="Connection lost" />
                <Connection status="error" message="Connection failed" />
              </VStack>
            </DemoCard>

            <DemoCard
              title="Actions - Horizontal Layout"
              description="Action buttons in horizontal arrangement"
            >
              <Actions
                actions={[
                  { id: '1', label: 'Save', variant: 'primary', onPress: () => toast.show({ placement: 'top', render: () => <Toast><ToastTitle>Saved!</ToastTitle></Toast> }) },
                  { id: '2', label: 'Cancel', variant: 'outline', onPress: () => {} },
                  { id: '3', label: 'Delete', variant: 'ghost', onPress: () => {} },
                ]}
                layout="horizontal"
                size="md"
              />
            </DemoCard>

            <DemoCard
              title="Actions - Vertical Layout"
              description="Action buttons stacked vertically"
            >
              <Actions
                actions={[
                  { id: '1', label: 'Primary Action', variant: 'primary', onPress: () => {} },
                  { id: '2', label: 'Secondary Action', variant: 'secondary', onPress: () => {} },
                  { id: '3', label: 'Tertiary Action', variant: 'outline', onPress: () => {} },
                ]}
                layout="vertical"
                size="md"
              />
            </DemoCard>

            <DemoCard
              title="Actions - Grid Layout"
              description="Action buttons in grid arrangement"
            >
              <Actions
                actions={[
                  { id: '1', label: 'Option 1', onPress: () => {} },
                  { id: '2', label: 'Option 2', onPress: () => {} },
                  { id: '3', label: 'Option 3', onPress: () => {} },
                  { id: '4', label: 'Option 4', onPress: () => {} },
                ]}
                layout="grid"
                size="sm"
              />
            </DemoCard>

            <DemoCard
              title="AI Chatbot"
              description="Full-featured conversation interface with message history"
            >
              <Box className="h-96 rounded-lg overflow-hidden border border-border">
                <AIChatbot
                  title="AI Assistant"
                  placeholder="Ask me anything..."
                />
              </Box>
            </DemoCard>
                  </ComponentSection>
                  <ComponentSection
                    title="Workflow Visualization"
                    description="Interactive workflow planner with drag-and-drop nodes and animated connections"
                  >
            <DemoCard
              title="AI Processing Pipeline"
              description="Drag nodes to reposition, lock/unlock editing, zoom in/out. Features animated edges and status indicators."
            >
              <Box className="h-96 rounded-lg overflow-hidden border border-border">
                <WorkflowPlanner
                  initialNodes={exampleNodes}
                  initialEdges={exampleEdges}
                />
              </Box>
            </DemoCard>
                  </ComponentSection>
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.delay(600).duration(400)}>
          <Box className="mt-8 mb-6">
            <Divider className="mb-6" />
            <VStack space="sm" className="items-center">
              <Text size="sm" className="text-center" style={{ color: mutedTextColor }}>
                Built with Expo 54, Gluestack UI v3, NativeWind v4 & Reanimated v3
              </Text>
              <HStack space="sm">
                <Badge>
                  <BadgeText>35+ Components</BadgeText>
                </Badge>
                <Badge action="success">
                  <BadgeText>Interactive</BadgeText>
                </Badge>
                <Badge action="info">
                  <BadgeText>Accessible</BadgeText>
                </Badge>
              </HStack>
            </VStack>
          </Box>
        </Animated.View>
          </View>
        </ResponsiveContainer>
      </ScrollView>
      <ThemeSwitcher />
    </>
  );
}
