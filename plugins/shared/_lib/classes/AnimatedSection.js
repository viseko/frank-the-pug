export default class AnimatedSection {
  constructor(elem, options) {
    this.elem = elem;
    this.onVisible = options.onVisible;
    this.onHide = options.onHide;
    this.repeatable = options.repeatable || true;
    this.fired = false;
    this.threshold = options.threshold || 0.2;

    const obj = this;

    const callback = function(entries) {
      const isIntersecting = entries[0].isIntersecting;
  
      if (isIntersecting) {
        if (obj.repeatable && obj.fired) return;
        obj.onVisible(obj.elem, obj);
        obj.fired = true;
      } else {
        obj.onHide && obj.onHide(obj.elem, obj);
      }
    };
  
    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px",
      threshold: obj.threshold,
    });
  
    observer.observe(elem);
  }
}