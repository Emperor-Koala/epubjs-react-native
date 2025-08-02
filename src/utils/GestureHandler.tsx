import React from "react"
import { DimensionValue, I18nManager, Platform, View } from "react-native"
import {
	GestureHandlerRootView,
	GestureDetector,
	Gesture,
	Directions,
  Pressable,
} from "react-native-gesture-handler"

interface Props {
	width?: DimensionValue
	height?: DimensionValue
	onSingleTap: () => void
	onDoubleTap?: () => void
	onSwipeLeft: () => void
	onSwipeRight: () => void
	onSwipeUp: () => void
	onSwipeDown: () => void
	onLongPress: () => void
	children: React.ReactNode
}

export function GestureHandler({
	width = "100%",
	height = "100%",
	onSingleTap,
	onDoubleTap,
	onSwipeLeft,
	onSwipeRight,
	onSwipeUp,
	onSwipeDown,
	onLongPress,
	children,
}: Props) {
	const singleTap = Gesture.Tap().runOnJS(true).maxDuration(250).onStart(onSingleTap)

	const doubleTap = Gesture.Tap()
		.runOnJS(true)
		.maxDuration(250)
		.numberOfTaps(2)
		.onStart(() => onDoubleTap?.())

	const longPress = Gesture.LongPress().runOnJS(true).onStart(onLongPress)

	const swipeLeft = Gesture.Fling()
		.runOnJS(true)
		.direction(I18nManager.isRTL ? Directions.RIGHT : Directions.LEFT)
		.onStart(onSwipeLeft)

	const swipeRight = Gesture.Fling()
		.runOnJS(true)
		.direction(I18nManager.isRTL ? Directions.LEFT : Directions.RIGHT)
		.onStart(onSwipeRight)

	const swipeUp = Gesture.Fling().runOnJS(true).direction(Directions.UP).onStart(onSwipeUp)

	const swipeDown = Gesture.Fling().runOnJS(true).direction(Directions.DOWN).onStart(onSwipeDown)

	const timer = React.useRef<NodeJS.Timeout | null>(null);

	const handleDoubleTap = React.useCallback(() => {
    if (!onDoubleTap) {
      onSingleTap();
      return;
    }
		if (timer.current) {
			onDoubleTap()
			clearTimeout(timer.current)
      timer.current = null
		} else {
			timer.current = setTimeout(() => {
				onSingleTap()
				clearTimeout(timer.current!)
				timer.current = null
			}, 500)
		}
	}, [timer, onSingleTap, onDoubleTap]);

	if (Platform.OS === "ios") {
		return (
			<GestureHandlerRootView style={{ flex: 1 }}>
				<GestureDetector
					gesture={Gesture.Exclusive(
						swipeLeft,
						swipeRight,
						swipeUp,
						swipeDown,
						longPress,
						doubleTap,
						singleTap,
					)}
				>
					<Pressable
						style={{ width, height }}
						onPress={handleDoubleTap}
						onLongPress={onLongPress}
					>
						{children}
					</Pressable>
				</GestureDetector>
			</GestureHandlerRootView>
		)
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector
				gesture={Gesture.Exclusive(
					swipeLeft,
					swipeRight,
					swipeUp,
					swipeDown,
					longPress,
					doubleTap,
					singleTap,
				)}
			>
				<View style={{ width, height }}>{children}</View>
			</GestureDetector>
		</GestureHandlerRootView>
	)
}
